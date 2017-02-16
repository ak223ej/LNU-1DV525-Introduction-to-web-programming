'use strict';

const factory = require('../factory');

test('Returns a dragable and resizeable div', () => {
  let div = factory.createDraggableDiv(null);
  console.log(div);
  expect(div.id).toBe(0);
})
