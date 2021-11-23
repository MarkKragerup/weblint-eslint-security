# Tests to be made:
#### (test typescript version in each rule as well)

- [ ] Allows safe value in same file
- [ ] Flags unsafe value in same file


- [ ] Allows unsafe value reassigned to safe value in same file
- [ ] Flags safe value reassigned to unsafe value in same file


- [ ] Allows value composed of multiple safe values in same the file (both in math operations, object modification, class instantiation, string manipulation and function invocations)
  - [ ] In case of mathematical operations
  - [ ] In case of object modification
  - [ ] In case of class instantiation
  - [ ] In case of string manipulation
  - [ ] In case of function invocations


- [ ] Flags value composed of multiple safe values and unsafe value in the same file (both in math operations, object modification, class instantiation, string manipulation and function invocations)
    - [ ] In case of mathematical operations
    - [ ] In case of object modification
    - [ ] In case of class instantiation
    - [ ] In case of string manipulation
    - [ ] In case of function invocations

...more