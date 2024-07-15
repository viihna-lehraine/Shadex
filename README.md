# ColorGen
## version 0.5 (pre-release)

ColorGen is a web-based color palette generator. It produces 8 varieties of color scheme and can convert between 6 color formats.

### NOTE
For regular use, please select the main branch. Branch v0.5-dev is not stable.

*** 

## Supported Palette Types

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

- Additional color schemes
- More flexibility for the number of swatches allowed on each palette type
- Aesthetic updates
- Making the UI less clunky in general
- Optimized mobile layout and functionality

***

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

***

## License

This project is released under the GNU General Public License, version 3. See the [LICENSE](LICENSE) file for details.

***

## Authors

- **Viihna Lehraine** - sole creator and contributor
- **Built With** - JavaScript, VS Code, Firefox, and unhealthy amounts of caffeine