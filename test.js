const test = require('tape')
const { Timer } = require('.')

test('countdown ticks', { timeout: 500 }, function (t) {
  const timer = new Timer({ interval: 10 })
  let lastms = 51

  timer.on('tick', (ms) => {
    if (lastms === 51) t.equal(ms, 50, 'first update should be 50')
    t.ok(ms < lastms, 'time decreasing')
    lastms = ms
  })

  timer.on('done', () => {
    t.equal(lastms, 0, 'last update should be 0')
    t.end()
  })

  timer.start(50)
})

// test('stopwatch ticks', { timeout: 500 }, function (t) {
//   const timer = new Timer({ interval: 10, stopwatch: true })
//   let lastms = -1

//   timer.on('tick', (ms) => {
//     if (lastms === -1) t.equal(ms, 0, 'first update should be 0')
//     t.ok(ms > lastms, 'time increasing')
//     lastms = ms
//   })

//   timer.on('done', () => {
//     t.equal(lastms, 50, 'last update should be 50')
//     t.end()
//   })

//   timer.start(50)
// })

test('stop', function (t) {
  const timer = new Timer({ interval: 10 })

  timer.on('done', () => t.fail())

  setTimeout(() => {
    t.equal(timer.status, 'stopped')
    t.end()
  }, 100)

  timer.start(50)
  t.equal(timer.status, 'running')
  timer.stop()
})

test('pause and resume', function (t) {
  const timer = new Timer({ interval: 10 })
  const startTime = Date.now()

  timer.on('done', () => {
    t.ok(Date.now() - startTime > 100, 'paused for at least 100ms')
    t.end()
  })

  setTimeout(() => {
    t.equal(timer.status, 'paused')
    timer.resume()
  }, 100)

  timer.start(50)
  t.equal(timer.status, 'running')
  timer.pause()
})

test('state transition', function (t) {
  const timer = new Timer({ interval: 10 })
  t.equal(timer.status, 'stopped')
  timer.stop()
  t.equal(timer.status, 'stopped')
  timer.pause()
  t.equal(timer.status, 'stopped')
  timer.resume()
  t.equal(timer.status, 'stopped')
  timer.start(20)
  t.equal(timer.status, 'running')
  timer.pause()
  t.equal(timer.status, 'paused')
  timer.resume()
  t.equal(timer.status, 'running')
  timer.stop()
  t.equal(timer.status, 'stopped')
  timer.start(20)
  t.equal(timer.status, 'running')
  timer.pause()
  timer.stop()
  t.equal(timer.status, 'stopped')
  timer.start(50)
  t.throws(() => timer.start(50), Error, 'Throw Error if already started')
  timer.on('done', () => {
    t.equal(timer.status, 'stopped')
    t.end()
  })
})

// test('duration property', function (t) {
//   const timer = new Timer({ interval: 10 })
//   timer.on('done', () => {
//     t.equal(timer.duration, 50, 'correct last duration')
//     t.end()
//   })

//   timer.start(50)
//   t.equal(timer.duration, 50, 'correct duration')
// })

test('time property', function (t) {
  const run = function (stopwatch) {
    const timer = new Timer({ interval: 10, stopwatch: stopwatch })
    timer.on('tick', (ms) => {
      const time = timer.time
      // TODO: last ms and time is not equal in stopwatch mode
      //       because we stop the timer before calling tick to ensure
      //       that .time won't be less than 0 or greater than duration
      if (stopwatch && ms === 50) return
      t.ok(time > ms - 5 && time < ms + 5, 'time should be around the ms param')
    })

    timer.on('done', () => {
      t.equal(timer.time, 0)
      if (stopwatch) t.end()
    })

    t.equal(timer.time, 0)
    timer.start(50)

    const rtime = timer.time
    timer.pause()
    const ptime = timer.time

    t.equal(rtime, ptime)

    setTimeout(() => {
      t.equal(ptime, timer.time)
      timer.resume()
    }, 20)
  }

  run(false)
  run(true)
})

test('override interval', function (t) {
  const timer = new Timer({ interval: 1000 })
  let ticks = 0

  timer.on('tick', (ms) => ticks++)

  timer.on('done', (ms) => {
    t.ok(ticks > 5, 'should do extra tick events')
    t.end()
  })

  timer.start(100, 10)
})

test('argument errors', function (t) {
  const timer = new Timer()
  t.throws(() => timer.start(), TypeError, 'Throw TypeError on missing duration parameter')
  t.end()
})
