const test = require('tape')

const findAdjacentPane = require('../../lib/find-adjacent-pane')

test('findAdjacentPane(pane, direction): returns adjacent pane right', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 0, y: 0, width: 100, height: 100},
        {id: 2, x: 100, y: 0, width: 100, height: 100},
        {id: 3, x: 200, y: 0, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'right'),
    {id: 2, x: 100, y: 0, width: 100, height: 100},
    'returns the next pane to the right'
  )
})

test('findAdjacentPane(pane, direction): returns adjacent pane left', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 200, y: 0, width: 100, height: 100},
        {id: 2, x: 100, y: 0, width: 100, height: 100},
        {id: 3, x: 0, y: 0, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 200,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'left'),
    {id: 2, x: 100, y: 0, width: 100, height: 100},
    'returns the next pane to the left'
  )
})

test('findAdjacentPane(pane, direction): returns adjacent pane up', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 0, y: 200, width: 100, height: 100},
        {id: 2, x: 0, y: 100, width: 100, height: 100},
        {id: 3, x: 0, y: 0, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 0,
    y: 200,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'up'),
    {id: 2, x: 0, y: 100, width: 100, height: 100},
    'returns the next pane above'
  )
})

test('findAdjacentPane(pane, direction): returns adjacent pane down', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 0, y: 0, width: 100, height: 100},
        {id: 2, x: 0, y: 100, width: 100, height: 100},
        {id: 3, x: 0, y: 200, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'down'),
    {id: 2, x: 0, y: 100, width: 100, height: 100},
    'returns the next pane below'
  )
})

test('findAdjacentPane(pane, direction): ' +
     'returns other pane to the right when there is no adjacent pane', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 0, y: 0, width: 100, height: 100},
        {id: 2, x: 100, y: 200, width: 100, height: 100},
        {id: 3, x: 200, y: 200, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'right'),
    {id: 2, x: 100, y: 200, width: 100, height: 100},
    'returns the next pane to the right'
  )
})

test('findAdjacentPane(pane, direction): ' +
     'returns other pane to the left when there is no adjacent pane', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 200, y: 0, width: 100, height: 100},
        {id: 2, x: 100, y: 200, width: 100, height: 100},
        {id: 3, x: 0, y: 200, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 200,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'left'),
    {id: 2, x: 100, y: 200, width: 100, height: 100},
    'returns the next pane to the left'
  )
})

test('findAdjacentPane(pane, direction): ' +
     'returns other pane above when there is no adjacent pane', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 200, y: 200, width: 100, height: 100},
        {id: 2, x: 0, y: 100, width: 100, height: 100},
        {id: 3, x: 0, y: 0, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 200,
    y: 200,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'up'),
    {id: 2, x: 0, y: 100, width: 100, height: 100},
    'returns the next pane above'
  )
})

test('findAdjacentPane(pane, direction): ' +
     'returns other pane below when there is no adjacent pane', t => {
  t.plan(1)
  const pane = {
    grid: {
      panes: [
        {id: 1, x: 200, y: 0, width: 100, height: 100},
        {id: 2, x: 0, y: 100, width: 100, height: 100},
        {id: 3, x: 0, y: 200, width: 100, height: 100}
      ]
    },
    id: 1,
    x: 200,
    y: 0,
    width: 100,
    height: 100
  }
  t.deepEquals(
    findAdjacentPane(pane, 'down'),
    {id: 2, x: 0, y: 100, width: 100, height: 100},
    'returns the next pane below'
  )
})
