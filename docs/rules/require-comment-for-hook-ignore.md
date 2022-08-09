# Prevent ignoring exhaustive-deps or rules-of-hooks without describing why (require-comment-for-hook-ignore)

## `exhaustive-deps`

This will trigger an error:

```tsx
const MyComponent = (props: PropType) => {
  useEffect(() => {
    if (props.something) {
      props.callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
```

To get rid of the error, either remove the eslint-ignore comment or create a comment above that explains why you are using the ignore.

```tsx
const MyComponent = (props: PropType) => {
  useEffect(() => {
    if (props.something) {
        props.callback();
    }
    // ignoring exhaustive-deps because this useEffect should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
```

## `rules-of-hooks`

This will trigger an error:

```tsx
const MyComponent = (props: PropType) => {
  if (props.something) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSomeHook();
  }
}
```

For debug purposes you can add a comment above the ignore to make the error go away, however it is strongly advised to reconsider your logic if you feel that you need to use a hook conditionally or inside a loop or function.

```tsx
const MyComponent = (props: PropType) => {
  if (props.something) {
    // for debug only
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSomeHook();
  }
}
```