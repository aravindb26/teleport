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
import { render } from 'design/utils/testing';

import {
  Loaded,
  Failed,
  RestrictedTokenCreateFailed,
} from './ManageDevices.story';

test('render device dashboard', () => {
  const { container } = render(<Loaded />);

  expect(container.firstChild).toMatchSnapshot();
});

test('render failed state for fetching devices', () => {
  const { container } = render(<Failed />);

  expect(container.firstChild).toMatchSnapshot();
});

test('render failed state for creating restricted privilege token', () => {
  const { container } = render(<RestrictedTokenCreateFailed />);

  expect(container.firstChild).toMatchSnapshot();
});
