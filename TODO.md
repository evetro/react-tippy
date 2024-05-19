# To do

The demo application and the package itself are to be rewritten with React 17, Vite and TS. Before the TS rewrite of the core module, we shall also be looking into some of the PRs in the abandoned parent library and

The following two props from the original repo will not be supported in the new version presented in this repository: *useContext*; *rawTemplate*. These props in particular facilitate leaking abstractions, and therefore  do not fit the general interace of a library.
