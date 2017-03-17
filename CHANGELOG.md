## CHANGELOG
### 0.4.3
Allow passing children through to components

### 0.4.2
Move back to `translate3d` and round values since half pixel placement was the culprit for causing blurry text

### 0.4.1
Don't use `translate3d` since it causes blurry text on lower res displays

### 0.4.0
Remove `getRef` function since it seems to be causing problems.

Move functional components to classes so we can get nodes more reliably.

Spread modifier styles inside `_getPopperStyle` [#6](https://github.com/souporserious/react-popper/pull/6)

### 0.3.0
Renamed `PopperManager` -> `Manager`

Added `getRef` prop to `Target`, `Popper`, and `Arrow` components

### 0.2.2
Bundle popper.js with dist build

### 0.2.1
Remove React ARIA from demos for now

### 0.2.0
New API see README for full docs

### 0.1.0
Initial release
