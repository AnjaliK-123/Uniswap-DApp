# Upgrade UniswapV2

UniswapV2 was written three years ago and uses outdated versions of Solidity tools.

## Project Goals

- Learn the UniswapV2 implementation.
- Learn Foundry, the next generation Ethereum development environment.

## Resources

- Read through the UniswapV2 code:
  - [Uniswap V2 Core](https://github.com/Uniswap/v2-core)
  - [Uniswap V2 Periphery](https://github.com/Uniswap/v2-periphery)
- Class Notes

## Project Steps

1. **Copy the UniswapV2 code** into a new Foundry project.

   - The original code had the core and periphery contracts in different repositories.
   - Combine them into a single repository to simplify development.
   - Make copies of the libraries rather than using package management.
   - Do not include `UniswapV2Router01`.

2. **Upgrade the UniswapV2 code** to the latest Solidity version that Foundry supports.

3. **Write Solidity tests** that achieve 100% line coverage for each of the following contracts:

   - `UniswapV2Router02`
   - `UniswapV2Pair`
   - `UniswapV2Factory`

4. **Generate a line coverage report** to assess the quality of your tests.

## Additional Notes

You may use any online resources for the project to aid in your learning and implementation.
