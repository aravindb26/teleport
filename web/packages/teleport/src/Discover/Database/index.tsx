/**
 * Teleport
 * Copyright (C) 2023  Gravitational, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';

import { AwsAccount, ResourceKind, Finished } from 'teleport/Discover/Shared';
import { ResourceViewConfig } from 'teleport/Discover/flow';
import { DatabaseWrapper } from 'teleport/Discover/Database/DatabaseWrapper';
import {
  ResourceSpec,
  DatabaseLocation,
} from 'teleport/Discover/SelectResource';

import { CreateDatabase } from 'teleport/Discover/Database/CreateDatabase';
import { SetupAccess } from 'teleport/Discover/Database/SetupAccess';
import { DeployService } from 'teleport/Discover/Database/DeployService';
import { ManualDeploy } from 'teleport/Discover/Database/DeployService/ManualDeploy';
import { MutualTls } from 'teleport/Discover/Database/MutualTls';
import { TestConnection } from 'teleport/Discover/Database/TestConnection';
import { DiscoverEvent } from 'teleport/services/userEvent';
import { EnrollRdsDatabase } from 'teleport/Discover/Database/EnrollRdsDatabase';
import { IamPolicy } from 'teleport/Discover/Database/IamPolicy';

export const DatabaseResource: ResourceViewConfig<ResourceSpec> = {
  kind: ResourceKind.Database,
  wrapper(component: React.ReactNode) {
    return <DatabaseWrapper>{component}</DatabaseWrapper>;
  },
  shouldPrompt(currentStep, resourceSpec) {
    if (resourceSpec.dbMeta?.location === DatabaseLocation.Aws) {
      // Allow user to bypass prompting on this step (Connect AWS Connect)
      // on exit because users might need to change route to setup an
      // integration.
      if (currentStep === 0) {
        return false;
      }
    }
    return true;
  },
  views(resource) {
    let configureResourceViews;
    if (resource && resource.dbMeta) {
      switch (resource.dbMeta.location) {
        case DatabaseLocation.Aws:
          configureResourceViews = [
            {
              title: 'Connect AWS Account',
              component: AwsAccount,
              eventName: DiscoverEvent.IntegrationAWSOIDCConnectEvent,
            },
            {
              title: 'Enroll RDS Database',
              component: EnrollRdsDatabase,
              eventName: DiscoverEvent.DatabaseRDSEnrollEvent,
            },
            {
              title: 'Deploy Database Service',
              component: DeployService,
              eventName: DiscoverEvent.DeployService,
              manuallyEmitSuccessEvent: true,
            },
            {
              title: 'Configure IAM Policy',
              component: IamPolicy,
              eventName: DiscoverEvent.DatabaseConfigureIAMPolicy,
            },
          ];

          break;

        case DatabaseLocation.SelfHosted:
          configureResourceViews = [
            {
              title: 'Register a Database',
              component: CreateDatabase,
              eventName: DiscoverEvent.DatabaseRegister,
            },
            {
              title: 'Deploy Database Service',
              component: ManualDeploy,
              eventName: DiscoverEvent.DeployService,
            },
            {
              title: 'Configure mTLS',
              component: MutualTls,
              eventName: DiscoverEvent.DatabaseConfigureMTLS,
            },
          ];

          break;
      }
    }

    return [
      {
        title: 'Configure Resource',
        views: configureResourceViews,
      },
      {
        title: 'Set Up Access',
        component: SetupAccess,
        eventName: DiscoverEvent.PrincipalsConfigure,
      },
      {
        title: 'Test Connection',
        component: TestConnection,
        eventName: DiscoverEvent.TestConnection,
        manuallyEmitSuccessEvent: true,
      },
      {
        title: 'Finished',
        component: Finished,
        eventName: DiscoverEvent.Completed,
        hide: true,
      },
    ];
  },
};
