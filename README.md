# ColorGen
## version 0.5.1 (pre-release / unstable)

***
ColorGen is a web-based color palette generator. It produces 8 varieties of color scheme and can convert between 6 color formats.

### NOTE
For regular use, please select the main branch. As stated above, this version as it currently exists is not intended for normal use.

*** 

## Table of Contents
- [Color Schemes](#color-shemes)
- [Color Spaces](#color-spaces)
- [Requirements](#requirements)
- [Installation - Windows](#windows-users) 
- [Installation - Linux](#linux-users)
- [Running the Project](#running-the-project)
- [Running the Project - Additional Information](#additional-information)
- [Features](#features)
- [Upcoming Features](#upcoming-features)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Contact](#contact-me)



***

## Color Schemes

- Random Single Color
- Complementary
- Split Complementary
- Triadic
- Tetradic
- Hexadic
- Analogous
- Diadic

## Color Spaces

- Hex
- RGB
- HSL
- HSV
- CMYK
- Lab (CIELAB)

***

## Requirements

- [Node.js](https://nodejs.org)
- Git installed on your system:
  - **Windows** - You can download it from [Git for Windows](https://gitforwindows.org) 
  - **Linux** - Download it using your system's package manager

***

## Installation

### Windows Users

1. **Open Command Prompt**:
    - Press `Win + R` to open the Run dialog.
    - Type `cmd` and press `Enter`.

    Alternatively, you can:
    - Click on the Start Menu.
    - Type `cmd` or `Command Prompt`.
    - Click on the `Command Prompt` application to open it.

2. **Clone the Repository**:
    - In the Command Prompt, navigate to the directory where you want to clone the repository using the `cd` command. For example:
      ```cmd
      cd path\to\your\directory
      ```
    - Clone the repository using Git:
      ```cmd
      git clone https://github.com/lost-possum/colorgen.git
      ```

### Linux Users

1. **Open Terminal**:
    - Press `Ctrl + Alt + T` to open a new terminal window.
   
    Alternatively:
    - Search for `Terminal` in your application menu and open it.

2. **Clone the Repository**:
    - In the Terminal, navigate to the directory where you want to clone the repository using the `cd` command. For example:
      ```bash
      cd /path/to/your/directory
      ```
    - Clone the repository using Git:
      ```bash
      git clone https://github.com/lost-possum/colorgen.git
      ```

***

## Running the Project

1. Navigate to the project directory:
    ```bash
    cd /path/to/the/repo
    ```

2. Install the 'http-server' globally if you haven't already done so:
    ```bash
    npm install -g http-server
    ```

3. Start the server:
    ```bash
    http-server .
    ```

4. Open your browser and go to:
    ```
    http://localhost:8080
    ```

***

## Additional Information
- For development, clone the repository and open the root directory in your preferred IDE.

***

## Features

- Drag and drop color swatches
- Copy color values with a single click
- Limit very dark colors (can be turned on or off)
- Limit very light and muted colors (can also be turned on or off)
- 8 types of color scheme
- Convert between 6 color spaces
- Define custom color, used as a base to generate your palette

***

## Upcoming Features

- Seperate page for color palette history
- Options for color palette export (from main page AND history)
- Getting rid of the annoying window alerts and instead auto-selecting the minimum number of color swatches
- Additional color schemes
- Choose the initially generated color space (allows for a larger color space; i.e., HSL has ~3.5 million possibile colors, while Hex has ~15 million)
- Copy button tooltip (will give you a visual alert that copy was successful)
- Double-clicking color values will let you highlight them, much like you would any other text
- UI overhaul and aesthetic updates
- Optimized mobile layout and functionality
- UI element explanation and tips that will show when hovering over them
- Additional parameters!
  1. Limit saturation
  2. Increase / Decrease saturation for individual swatches
  3. Increase / Decrease lightness for individual swatches
  3. Block duplicate colors
  4. Block pure white and black

and finally

- Smarter algorithms for all the palettes. I acknowledge they are not perfect, or even great yet. I will strive to get these into a better state for less bizarre outputs :)


Farther in the future (around 1.0) I also plan to release this as a desktop app (Windows / MacOS / Linux compatible) and mobile app (Android and iOS). However, iOS development may have to come out later. I'll give more details when I start work on porting these versions.

***

## Known Issues

Please be aware that, in its current state, I have not done a full test session to track bugs. These are just the ones I've noticed so far. Feel free to [contact](#contact-me) me to point out any bugs I haven't listed here yet!

- Drag and Drop works for a short period of time before breaking
- Drag and Drop doesn't work at all on mobile
- Saturate and Desaturate buttons do absolutely nothing
- Mobile layout needs a full rework
- Gray/Black limiting and Light limiting are very primitive. Both need adjustment
- Gray/Black limiting and Light limiting will only work for HSL color space
- Diadic palette logic needs investigation. I'm not convinced it is working correctly

***

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

***

## License

This project is released under the GNU General Public License, version 3. See the [LICENSE](LICENSE) file for details.

***

## Author

- **Viihna Lehraine** - sole creator and contributor
- **Built With** - Vanilla JavaScript, VS Code, Firefox, and unhealthy amounts of caffeine

***

## Contact Me

- viihna@voidfucker.com
- viihna.78 (Signal)
- dr.face. (Discord)