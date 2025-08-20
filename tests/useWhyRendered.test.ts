import { renderHook } from '@testing-library/react';
import { useWhyRendered } from '../src/useWhyRendered';

describe('useWhyRendered', () => {
  let consoleGroupSpy: jest.SpyInstance;
  let consoleTableSpy: jest.SpyInstance;
  let consoleGroupEndSpy: jest.SpyInstance;

  const expectLogged = (times = 1) => {
    expect(consoleGroupSpy).toHaveBeenCalledTimes(times);
    expect(consoleGroupSpy).toHaveBeenCalledWith('[react-why-rendered] TestComponent re-rendered');
    expect(consoleTableSpy).toHaveBeenCalledTimes(times);
    expect(consoleGroupEndSpy).toHaveBeenCalledTimes(times);
  };

  const expectNotLogged = () => {
    expect(consoleGroupSpy).not.toHaveBeenCalled();
    expect(consoleTableSpy).not.toHaveBeenCalled();
    expect(consoleGroupEndSpy).not.toHaveBeenCalled();
  };

  beforeEach(() => {
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
    consoleTableSpy = jest.spyOn(console, 'table').mockImplementation(() => {});
    consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not log on initial render', () => {
    renderHook(() => useWhyRendered('TestComponent', { a: 1 }));
    expectNotLogged();
  });

  it('logs when props change', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { a: 1, b: 2 } } }
    );

    rerender({ props: { a: 2, b: 2 } });

    expectLogged();
    expect(consoleTableSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({ name: 'a', before: 1, after: 2 }),
        ])
    );
  });

  it('logs when state changes', () => {
    type PropsAndState = { a?: number; count?: number };

    const { rerender } = renderHook(
        ({ props, state }: { props: PropsAndState; state: PropsAndState }) =>
        useWhyRendered('TestComponent', props, state),
        { initialProps: { props: { a: 1 }, state: { count: 0 } } }
    );

    rerender({ props: { a: 1 }, state: { count: 1 } });

    expectLogged();
    expect(consoleTableSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({ name: 'count', before: 0, after: 1 }),
        ])
    );
  });

  it('does not log if there are no changes', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { a: 1 } } }
    );

    rerender({ props: { a: 1 } });

    expectNotLogged();
  });

  it('logs deeply nested prop changes', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { a: { b: { c: 1 } } } } }
    );

    rerender({ props: { a: { b: { c: 2 } } } });

    expectLogged();
  });

  it('logs when array reference changes', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { items: [1, 2, 3] } } }
    );

    rerender({ props: { items: [1, 2, 3] } });

    expectLogged();
  });

  it('does not log when same function reference is passed', () => {
    const fn = () => {};
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { onClick: fn } } }
    );

    rerender({ props: { onClick: fn } });

    expectNotLogged();
  });

  it('logs when new function reference is passed', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyRendered('TestComponent', props),
      { initialProps: { props: { onClick: () => {} } } }
    );

    rerender({ props: { onClick: () => {} } }); // new fn ref

    expectLogged();
  });
});
