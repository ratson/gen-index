import execa from 'execa'
import test from 'ava'

test('single --dir', async t => {
  const { code, stderr, stdout } = await execa(
    require.resolve('../cli.js'),
    ['--dir', '.', '--dry-run'],
    {
      reject: false,
    }
  )
  t.is(code, 0, stderr)
  t.is(stdout.match(/AUTOGENERATED/g).length, 1)
})

test('multiple --dir', async t => {
  const { code, stderr, stdout } = await execa(
    require.resolve('../cli.js'),
    ['--dir', '.', '--dir', 'test', '--dry-run'],
    {
      reject: false,
    }
  )
  t.is(code, 0, stderr)
  t.is(stdout.match(/AUTOGENERATED/g).length, 2)
})
