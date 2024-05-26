# To do

The demo application and the package itself are to be rewritten with React 17, Vite and TS. Before the TS rewrite of the core module, we shall also be looking into some of the PRs in the abandoned parent library and write the most relevant changes into the fork manually.

The following two props from the original repo will not be supported in the new version presented in this repository: *useContext*; *rawTemplate*. These props in particular facilitate leaking abstractions, and therefore do not fit the general interace of a library.

## Status on repo

As of the day of this commit, we've gotten the rewritten demo app using React Context and TypeScript to compile and run correctly.

## PRs on source repository

*x* denotes that the PR code has been integrated into this fork

 - [] [178 Add appendTo feature in Tooltip](https://github.com/tvkhoa/react-tippy/pull/178) 
 - [x] [176 Add children prop to TooltipProps interface](https://github.com/tvkhoa/react-tippy/pull/176)
 - [x] [174 Event function classes for props](https://github.com/tvkhoa/react-tippy/pull/174)
 - [] [171 Added more typings for props](https://github.com/tvkhoa/react-tippy/pull/171)
 - [] [165 Check if data-original-title exists before assign it to the title attribute](https://github.com/tvkhoa/react-tippy/pull/165)
 - [] [163 Add zIndex prop to type definition](https://github.com/tvkhoa/react-tippy/pull/163)
 - [] [155 Fix 'placement' prop being named 'position' in README](https://github.com/tvkhoa/react-tippy/pull/155)
 - [x] [151 Fix type for delay prop](https://github.com/tvkhoa/react-tippy/pull/151)
 - [] [148 adding inline styling](https://github.com/tvkhoa/react-tippy/pull/148)
 - [] [139 Add possibility to cancel from onShow event](https://github.com/tvkhoa/react-tippy/pull/139)
 - [x] [133 corrected type for stickyDuration](https://github.com/tvkhoa/react-tippy/pull/133)
 - [] [132 Feat: add possibility to hide tooltip on window scroll](https://github.com/tvkhoa/react-tippy/pull/132)
 - [] [114 Fix issues related to title and html props](https://github.com/tvkhoa/react-tippy/pull/114)
 - [x] [98 added a more robust (but succinct) e.g. of showing/hiding tooltip in readme](https://github.com/tvkhoa/react-tippy/pull/98)
 - [] [91 Update doc for tooltip custom theme](https://github.com/tvkhoa/react-tippy/pull/91/files)
 - [] [90 Set and remove element aria-describedby base on popper](https://github.com/tvkhoa/react-tippy/pull/90)
 - [x] [87 Fix transitions (especially on manual triggering)](https://github.com/tvkhoa/react-tippy/pull/87)
