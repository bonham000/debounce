/**
 * Debounces a function's execution by a certain time.
 *
 * The returned function will delay execution until the debounceTime has
 * elapsed since the last execution.
 */
function debounce<Args extends any[]>(
  fn: (...args: Args) => void,
  debounceTime = 30
): (...args: Args) => void {
  let canExecute = true;

  return (...args: Args) => {
    if (canExecute === false) {
      return;
    }

    canExecute = false;
    fn(...args);

    setTimeout(() => {
      canExecute = true;
    }, debounceTime);
  };
}

// ----------------------------------------------------------------------------
// Tests:

function arrayOfLength(len: number): null[] {
  return new Array(len).fill(null);
}

function randomInt(min = 1, max = 10): number {
  return Math.floor(Math.random() * (max - min) + min);
}

async function wait(time = 100): Promise<void> {
  return new Promise((resolve, _) => setTimeout(resolve, time));
}

async function testDebounceFunction() {
  let value = 0;

  // Test using multiple arguments:
  const fn = (a: number, b: number) => {
    value += a + b;
  };

  const DEBOUNCE_TIME = 50;
  const debouncedFn = debounce<Parameters<typeof fn>>(fn, DEBOUNCE_TIME);

  const handleTest = async (): Promise<void> => {
    let initialValue = value;
    const a = randomInt();
    const b = randomInt();

    debouncedFn(a, b);
    debouncedFn(randomInt(), randomInt());
    debouncedFn(randomInt(), randomInt());
    debouncedFn(randomInt(), randomInt());

    // Only the first of the above invocations should have executed.
    const increment = a + b;
    const expectedValue = initialValue + increment;
    console.info(
      `Results: initialValue = ${initialValue}, increment = ${increment}, finalValue = ${value}.`
    );

    if (value !== expectedValue) {
      throw new Error(
        `Expected values don't match. Expected ${value} to be ${expectedValue}.`
      );
    }
  };

  try {
    console.log("Testing debounce function.");
    for (const _ of arrayOfLength(25)) {
      await handleTest();
      await wait(DEBOUNCE_TIME);
    }
    console.log("Test Passed.");
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

testDebounceFunction();
