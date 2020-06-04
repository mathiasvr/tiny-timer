const test = require('tape')
const { Timer } = require('.')


test('stopwatch ticks', { timeout: 500 }, function (t) {
  const timer = new Timer({ interval: 10 })
  let lastms = -1

  timer.on('tick', (ms) => {
    if (lastms === -1) t.equal(ms, 0, 'first update should be 0')
    t.ok(ms > lastms, 'time increasing')
    lastms = ms
  })

  setTimeout(() => {
    timer.stop()
    t.end()
  }, 100)

  timer.start()
})

test('stop', function (t) {
  const timer = new Timer({ interval: 10 })

  timer.on('done', () => t.fail())

  setTimeout(() => {
    t.equal(timer.status, 'stopped')
    t.end()
  }, 100)

  timer.start()
  t.equal(timer.status, 'running')
  timer.stop()
})

test('pause and resume', function (t) {
  const timer = new Timer({ interval: 10 })
  const startTime = Date.now()

  timer.on('done', () => {

  })

  setTimeout(() => {
    t.equal(timer.status, 'paused')
    timer.resume()
  }, 100)

  setTimeout(() => {
    timer.stop()
    t.ok(Date.now() - startTime > 100, 'paused for at least 100ms')
    t.end()
  }, 300)


  timer.start()
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
  timer.start()
  t.equal(timer.status, 'running')
  timer.pause()
  t.equal(timer.status, 'paused')
  timer.resume()
  t.equal(timer.status, 'running')
  timer.stop()
  t.equal(timer.status, 'stopped')
  timer.start()
  t.equal(timer.status, 'running')
  timer.pause()
  timer.stop()
  t.equal(timer.status, 'stopped')
  timer.start()
  t.throws(() => timer.start(), Error, 'Throw Error if already started')
  timer.stop()
  t.equal(timer.status, 'stopped')
  t.end()
})

test('time property', function (t) {

    const timer = new Timer({ interval: 10 })
    timer.on('tick', (ms) => {
      const time = timer.time
      // TODO: last ms and time is not equal in stopwatch mode
      //       because we stop the timer before calling tick to ensure
      //       that .time won't be less than 0 or greater than duration
      if (ms === 50) return
      t.ok(time > ms - 5 && time < ms + 5, 'time should be around the ms param')
    })

    setTimeout(() => {
      timer.stop()
      t.equal(timer.time, 0)
      t.end()
    }, 200)

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
  


})

test('override interval', function (t) {
  const timer = new Timer({ interval: 1000 })
  let ticks = 0

  timer.on('tick', (ms) => ticks++)

  setTimeout (() => {
    timer.stop()
    t.ok(ticks > 5, 'should do extra tick events')
    t.end()
  }, 100)

  timer.start(10)
})
