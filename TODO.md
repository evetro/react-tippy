# To do

The demo application and the package itself are to be rewritten with React 17,
Vite and TS. Before the TS+hooks rewrite of the core module, we shall also be
looking into 15 of the unresolved PRs in the abandoned parent library and
port their code changes into the fork manually.

The following two props from the original repo will not be supported in the new
version presented in this repository: *useContext*; *rawTemplate*. These props
in particular facilitate leaking abstractions, and therefore do not fit the
general interace of a library. This new library will also be dropping support
for Internet Explorer completely, which should be expected policy in
**CURRENT_YEAR**. We will on the other hand strive to maintain compatibility
with most other mainstream browsers that support the Web APIs required for
PopperJS to work.

## Status on repo

As of 26.05.24, we've gotten the rewritten demo app using React Context and
TypeScript to compile and run correctly. Getting the documentation in the README
file up to speed will have immediate top priority going forward. After that,
the ramaining PRs in the list will be attended to, and then our breaking API
changes with removing the props *useContext* and *rawTemplate* will be applied.

## PRs from source repository

*[v]* denotes that the PR code has been integrated into this fork

 - [ ] [178 Add appendTo feature in Tooltip](https://github.com/tvkhoa/react-tippy/pull/178)
 - [x] [176 Add children prop to TooltipProps interface](https://github.com/tvkhoa/react-tippy/pull/176)
 - [x] [174 Event function classes for props](https://github.com/tvkhoa/react-tippy/pull/174)
 - [x] [171 Added more typings for props](https://github.com/tvkhoa/react-tippy/pull/171)
 - [x] [165 Check if data-original-title exists before assign it to the title attribute](https://github.com/tvkhoa/react-tippy/pull/165)
 - [x] [163 Add zIndex prop to type definition](https://github.com/tvkhoa/react-tippy/pull/163)
 - [x] [151 Fix type for delay prop](https://github.com/tvkhoa/react-tippy/pull/151)
 - [ ] [139 Add possibility to cancel from onShow event](https://github.com/tvkhoa/react-tippy/pull/139)
 - [x] [133 corrected type for stickyDuration](https://github.com/tvkhoa/react-tippy/pull/133)
 - [ ] [132 Feat: add possibility to hide tooltip on window scroll](https://github.com/tvkhoa/react-tippy/pull/132)
 - [x] [114 Fix issues related to title and html props](https://github.com/tvkhoa/react-tippy/pull/114)
 - [x] [98 added a more robust (but succinct) e.g. of showing/hiding tooltip in readme](https://github.com/tvkhoa/react-tippy/pull/98)
 - [x] [91 Update doc for tooltip custom theme](https://github.com/tvkhoa/react-tippy/pull/91/files)
 - [x] [90 Set and remove element aria-describedby base on popper](https://github.com/tvkhoa/react-tippy/pull/90)
 - [x] [87 Fix transitions (especially on manual triggering)](https://github.com/tvkhoa/react-tippy/pull/87)
