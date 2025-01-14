# IDBManager

***

## Table of Contents

- **[Overview](#overview)**
- **[Methods](#Methods)**
	- **[Static Methods](#1-static-methods)**
		- **[createInstance()](#1a-createinstance)**
		- **[getInstance()](#1b-getinstance)**
		- **[resetInstance()](#1c-resetinstance)**
	- **[Public Methods](#2-public-methods)**
		- **[createMutationLogger](#2a-createmutationloggertobj-t-key-string-t)**
		- **[createPaletteTable](#2b-createpalettetablepalette-storedpalette-htmlelement)**
		- **[getCurrentPaletteId](#2c-getcurrentpaletteid-promisenumber)**
		- **[getCustomColor](#2d-getcustomcolor-promisehsl--null)**
		- **[getLoggedObject](#2e-getloggedobjectobj-t--null-key-string-t--null)**
		- **[getNextTableId](#2f-getnexttableid-promisestring--null)**
		- **[getNextPaletteId](#2g-getnextpaletteid-promisenumber--null)**
		- **[getSettings](#2h-getsettings-promisesettings)**
		- **[getStore](#2i-getstorestorename-extends-keyof-paletteschemastorename-storename-mode-readonly--readwrite)**
		- **[initializeDB](#2j-initializedb-promisevoid)**
		- **[renderPalette](#2k-renderpalettetableid-string-promisevoid--null)**
		- **[resetDatabase](#2l-resetdatabase-promisevoid--null)**
		- **[saveData](#2m-savedatatstorename-keyof-paletteschema-key-string-data-t-oldvalue-t-promisevoid--null)**
		- **[savePaletteId](#2n-savepaletteid-string-newpalette-storedpalette-promisevoid--null)**
		- **[savePaletteToDB](#2o-savepalettetodbtype-string-items-paletteitem-basecolor-hsl-numboxes-number-enablealpha-boolean-limitdark-boolean-limitgray-boolean-limitlight-boolean-promisepalette--null)**
		- **[saveSettings](#2p-savesettingsnewsettings-settings-promisevoid--null)**
		- **[updateEntryInPalette](#2q-updateentryinpalettetableid-string-entryindex-number-newentry-paletteitem-promisevoid--null)**
		- **[deleteDatabase](#2r-deletedatabase-promisevoid)**
	- **[Private Methods](#3-private-methods)**
		- **[debugError](#3a-debugerrorcontext-string-error-unknown-void)**
		- **[formatLogMessage](#3b-formatlogmessageaction-string-details-recordstring-unknown-string)**
		- **[getDB](#3c-getdb-promisepalettedb)**
		- **[getDefa8ltKey](#3d-getdefaultkeykey-keyof-typeof-thisdefault_keys-string)**
		- **[getStoreNames](#3e-getstorenamestorekey-keyof-typeof-thisstore_names-string)**
		- **[getTableId](#3f-gettableid-string-promisestoredpalette--null)**
		- **[handleAsync](#3g-handleasynctaction---promiset-errormessage-string-context-recordstring-unknown-promiset--null)**
		- **[logMessage](#3h-logmessage-string-level-info--warn--error--info-void)**
		- **[logMutation](#3i-logmutationlog-mutationlog-promisevoid--null)**
		- **[resolveKey](#3j-resolvekeyk-extends-keyof-typeof-thisdefault_keyskey-k-string)**
		- **[resolveStoreNames](#3k-resolvestorenames-extends-keyof-typeof-thisstore_namesstore-s-string)**
		- **[updateCurrentPaletteId](#3l-updatecurrentpaletteidnewid-number-promisevoid--null)**

<br>

***

## Overview

### **A. Class Description**<br>
IDBManager is a singleton class that manages the IndexedDB database for the application. It provides methods to interact with the database, such as creating, updating, deleting, and retrieving data. This class also handles the initialization and management of database object stores.

#### **Implements**<br>
* IDBManagerInterface

### **B. Class Properties**<br>

- **B1. Static Properties**<br>
	* **_instance: IDBManager | null_**
		- **Description**: Stores the singleton instance of the IDBManager class.
		- **Access**: Private.
- **B2. Instance Properties**<br>
	* **_adapter_**
		- **Description**: Acts as a bridge between the environment and IndexedDB so that it may be more easily abstracted.
		- **Access:** Private.
	* **_cache: Partial<{ settings: Settings; customColor: HSL }>_**
		- **Description**: A cache for frequently accessed settings and custom color data.
		- **Access**: Private.
	* **_dbPromise: Promise\<IDBPDatabase\<PaletteSchema\>\>_**
		- **Description:** A promise that resolves to the IDBPDatabase instance, representing the IndexedDB database.
		- **Access**: Private.
	* **_defaultSettings: Settings_**
		- **Description:** The default application settings for the database.
		- **Access:** Private.
	* **__mode: ModeData_**
		- **Description:** Configuration object for controlling logging, debugging, and other runtime behaviors.
		- **Access:** Private
	* **_DEFAULT_KEYS: { APP_SETTINGS: string; CUSTOM_COLOR: string }_**
    	- **Description:** Key constants for identifying specific entries in object stores.
    	- **Access:** Private.
	* **_STORE_NAMES: { CUSTOM_COLOR: string; MUTATIONS: string; SETTINGS: string; TABLES: string }_**
    	- **Description:** Store name constants for the IndexedDB object stores.
    	- **Access:** Private.

### **Constructor**

#### constructor()<br>
- **Access:** Private.<br>
- **Description:** Initializes the IDBManager instance by setting default settings, mode configurations, and store constants. It also initializes the IndexedDB instance with the appropriate object stores.<br>

#### Behavior<br>
1. Sets default values for defaultSettings, mode, DEFAULT_KEYS, and STORE_NAMES using predefined constants from the data module.
Opens the paletteDB IndexedDB database:
2. If the database does not exist, it creates the following object stores:
	* customColor
	* mutations
	* palettes
	* settings
	* tables
3. Sets the keyPath to timestamp for the mutations store and key for other stores.

#### **Example Usage**<br>
This constructor is private and cannot be called directly. Use the static createInstance() or getInstance() methods to obtain an instance of IDBManager.

### Notes
* The singleton pattern ensures only one instance of IDBManager is created throughout the application's lifecycle.
* Object stores and their key paths are configured during database initialization in the upgrade callback of openDB.

***
***
***

## Methods

### 1. Static Methods

***
***

#### **1a. createInstance()**<br>

**Description**<br>
Asynchronously creates a singleton instance of the IDBManager class and initializes the database if it has not already been instantiated. This method ensures that only one instance of the manager exists. Note that when the app is loaded, this is the method which must be called, otherwise the database will not be properly initialized.

**Signature**<br>
```
public static async createInstance\(\): Promise\<IDBManager\>
```

**Returns**<br>
* Promise\<IDBManager\>
	* Resolves with the singleton IDBManager instance.

**Behavior**<br>
1. Checks if an instance of IDBManager already exists:
    * If not, it creates a new instance of IDBManager and initializes the database using initializeDB().
2. Returns the singleton instance.

**Example Usage**<br>
```
const idbManager = await IDBManager.createInstance();

console.log('IDBManager instance created and initialized:', idbManager);

```

***
***

#### **1b. getInstance()**<br>

**Description**<br>
Synchronously retrieves the singleton instance of the IDBManager class. If no instance exists, it creates one without initializing the database.

**Signature**<br>
```
public static getInstance(): IDBManager
```

**Returns***<br>
* IDBManager
	* the singleton IDBManager instance.

**Behavior**<br>
1. Checks if an instance of IDBManager already exists:
    * If not, it creates a new instance without calling initializeDB().
2. Returns the singleton instance.

**Example Usage**<br>
```
const idbManager = IDBManager.getInstance();

console.log('IDBManager instance retrieved:', idbManager);

```

***
***

#### **1c. resetInstance()**<br>

**Description**<br>
Resets the singleton instance of the IDBManager class to null. This allows a new instance to be created the next time createInstance() is called.

**Returns**<br>
* void

**Behavior**<br>
1. Sets the internal instance variable to null.
2. This effectively removes the current IDBManager instance.

**Example Usage**<br>
```
IDBManager.resetInstance();

console.log('IDBManager instance has been reset.');
```

**Notes**<br>
* Use createInstance when you need to ensure the database is initialized before using the IDBManager.
* Use getInstance when you only need access to the singleton instance without re-initializing it.
* Use resetInstance during testing, debugging, or when the current instance needs to be discarded.

***
***
***

### 2. Public Methods

***
***

#### **2a. createMutationLogger\<T\>\(obj: T, key: string\): T**

**Description**<br>
Creates a proxy around the provided object to log any mutations. Each time a property is updated, the change is logged using the logMutation method.

**Purpose**<br>
Track changes to an object's properties, ensuring a clear record of when and how mutations are occurring. Intended to aid debugging, auditing, and tracking application state changes in a persistent, easily observable manner.

**Parameters**<br>
1. obj: T
	* the object to be wrapped in a proxy
2. key: string
	* unique object identifier used to associate logged mutations with the object

**Returns**<br>
* a proxied version of the input object (T) with mutation logging functionality.

**Considerations**<br>
* This method ONLY works on objects
* Logs mutations but does nothing to enforce immutability or prevent further changes to the object
* Take care to ensure that the logMutation() method is properly implemented and bound to the instance so as to avoid runtime errors.

**Usage Example**<br>
```
const susObject = { name: 'Amogus', age: 69 };

const manager = IDBManager.getInstance();
const proxiedObject = manager.createMutationLogger( 'susObject');

proxiedObject.name = 'Jeff';   // logs the mutation: name changed from 'Amogus' to 'Jeff'
proxiedObject.age = 420;   // logs the mutation: age changed from 69 to 420
```

**Sample Log Entry**<br>

***
***

#### **2b. createPaletteTable(palette: StoredPalette): HTMLElement**

**Description**<br>
Creates and returns an HTML table element representing the colors in the provided '**StoredPalette**'. Each row in the table corresponds to a color, displaying its index and a visual representation of the color.

**Purpose**<br>
* To visually represent a color palette in the DOM.
* To create a reusable HTML element that can be inserted into the application interface.

**Parameters**<br>
1. palette: StoredPalette
	* The palette to be rendered into an HTML table. It should include an array of palette items, each of which contains details about a color.

**Returns**<br>
* an HTML element representing the palette as a table.

**How It Works**<br>
1. DocumentFragment is created to serve as a container for the table.
2. An HTML table element is created and assigned the palette-table CSS class.
3. For each color in the palette.items array:
    * A new table row is created.
    * A cell containing the color's index (e.g., "Color 1") is added.
    * A color preview box is styled with the color's hexCSSString and added to the row.
    * The row is appended to the table.
4. The table is appended to the DocumentFragment.
5. The method casts the fragment to an HTMLElement before returning it.

**Considerations**<br>
* Ensure that the palette.items array and its cssStrings.hexCSSString properties are correctly populated to avoid runtime errors.
* This method focuses only on creating the table structure; it does not handle appending the table to the DOM or managing events.

**Usage Example**<br>
```
const palette = {
  palette: {
    items: [
      { cssStrings: { hexCSSString: '#FF5733' } },
      { cssStrings: { hexCSSString: '#33FF57' } },
      { cssStrings: { hexCSSString: '#3357FF' } },
    ]
  }
};

const manager = IDBManager.getInstance();
const paletteTable = manager.createPaletteTable(palette);

document.getElementById('palette-container')?.appendChild(paletteTable);
```

**Output Example**<br>
```
<table class="palette-table">
  <tr>
    <td><div class="color-box" style="background-color: #FF5733;"></div></td>
    <td>Color 1</td>
  </tr>
  <tr>
    <td><div class="color-box" style="background-color: #33FF57;"></div></td>
    <td>Color 2</td>
  </tr>
  <tr>
    <td><div class="color-box" style="background-color: #3357FF;"></div></td>
    <td>Color 3</td>
  </tr>
</table>
```
* *this is not intended to be a complete example of the returned table*

***
***

#### **2c. getCurrentPaletteID\(\): Promise\<number\>**

**Description**<br>
Retrieves the current palette ID from the settings stored in IndexedDB. If no palette ID is found, the method returns 0 as the default.

**Purpose**<br>
To fetch the lastPaletteID property from the application settings stored in IndexedDB. This ID represents the most recently used or created palette.

**Returns**<br>
* a Promise\<number\> that resolves to the current palette ID (lastPaletteID) stored in IndexedDB. Defaults to 0 if the value is not found.

**How It Works**<br>
1. The method wraps the retrieval process in a call to handleAsync, which provides error handling for asynchronous operations.
2. The IndexedDB database is obtained by calling getDB().
3. The method retrieves the application settings by using:
4. The SETTINGS store name from getStoreName('SETTINGS').
5. The APP_SETTINGS key from getDefaultKey('APP_SETTINGS').
6. If the application is in debug mode (this.mode.debug), it logs the fetched settings to the console for troubleshooting.
7. The method extracts and returns the lastPaletteID property from the settings object:
8. If lastPaletteID is undefined, it defaults to 0.

**Parameters**<br>
This method does not take any parameters.

**Usage Example**<br>
```
const currentPaletteID = await idbManager.getCurrentPaletteID();

console.log(`Current Palette ID: ${currentPaletteID}`);
```

***
***

#### **2d. getCustomColor(): Promise\<HSL | null\>**

**Description**<br>
Retrieves the custom color stored in IndexedDB and caches it. Returns the color wrapped in a mutation-logged proxy, or null if no custom color is found.

**Purpose**<br>
To fetch and manage the custom color from the CUSTOM_COLOR store in IndexedDB.

**Returns**<br>
A Promise(HSL | null) resolving to either:
1. An HSL object wrapped in a mutation logger if a custom color exists.
2. null if no custom color is found.

**How It Works**<br>
1. Resolves the CUSTOM_COLOR key and store name using resolveKey and resolveStoreName.
2. Fetches the custom color entry from the database.
3. If no color is found, returns null.
4. Caches the fetched color and wraps it in a mutation logger using createMutationLogger.
5. Handles errors using handleAsync with a descriptive error message.

**Usage Example**<br>
```
const customColor = await idbManager.getCustomColor();

if (customColor) console.log(`Custom color: ${customColor}`);
```

***
***

#### 2e. **getLoggedObject<T extends object>(obj: T | null, key: string): T | null**

**Description**<br>
Wraps an object in a mutation logger if it exists. Returns null if the object is null.

**Purpose**<br>
To provide mutation logging for objects while preserving their original reference.

**Parameters**
* obj
	* An object of type T to be wrapped, or null.
* key
	* A string representing the key to associate with the logged object.

**Returns**<br>
The original object wrapped in a mutation logger, or null if the input is null.

**How It Works**<br>
1. Checks if obj is non-null.
2. Wraps the object in a mutation logger using createMutationLogger.
3. Returns the wrapped object or null.

**Usage Example**<br>
```
const loggedSettings = idbManager.getLoggedObject(settings, 'settings');

if (loggedSettings) loggedSettings.someProperty = 'newValue';
```

***
***

#### **2f. getNextTableID\(\): Promise\<string \| null\>**

**Description**<br>
Calculates the next table ID based on the last saved table ID in settings and updates the settings with the new ID.

**Purpose**<br>
To generate a unique table ID for new palette tables in IndexedDB.

**Returns**<br>
A Promise\<string \| null\> resolving to the new table ID (e.g., "palette_1"), or null if an error occurs.

**How It Works**<br>
1. Retrieves the application settings using getSettings.
2. Increments the lastTableID value.
3. Saves the updated settings back to the database.
4. Constructs the next table ID as "palette_{nextID}".

**Error Handling**<br>
Logs errors using handleAsync with the message:
"IDBManager.getNextTableID(): Error fetching next table ID"

**Usage Example**<br>
```
const nextTableID = await idbManager.getNextTableID();

console.log(`Next table ID: ${nextTableID}`);
```

***
***

#### **2g. getNextPaletteID\(\): Promise\<number \| \null\>**

**Description**<br>
Calculates the next palette ID based on the current palette ID, updates the database with the new value, and returns it.

**Purpose**<br>
To manage sequential palette IDs for the application.

**Returns**<br>
A Promise<number | null> resolving to the next palette ID, or null if an error occurs.

**How It Works**<br>
1. Retrieves the current palette ID using getCurrentPaletteID.
2. Increments the ID and updates it in the database with updateCurrentPaletteID.
3. Logs a stack trace if the stackTrace mode is enabled.

**Error Handling**<br>
Logs errors using handleAsync with the message:
"IDBManager.getNextPaletteID(): Error fetching next palette ID"

**Usage Example**<br>
```
const nextPaletteID = await idbManager.getNextPaletteID();

console.log(`Next palette ID: ${nextPaletteID}`);
```

***
***

#### **2h. getSettings\(\): Promise\<Settings\>**

**Description**<br>
Fetches the application settings from IndexedDB. If no settings exist, returns the default settings.

**Purpose**<br>
To retrieve and manage application settings stored in IndexedDB.

**Returns**<br>
A Promise\<Settings\> resolving to either<br>
* The stored settings object, if available.
* The default settings object otherwise.

**How It Works**<br>
1. Obtains the database using getDB.
2. Fetches the APP_SETTINGS entry from the SETTINGS store.
3. Returns the retrieved settings or the default settings if no entry is found.

**Error Handling**<br>
Logs errors using handleAsync with the message:
"IDBManager.getSettings(): Error fetching settings"

**Usage Example**<br>
```
const settings = await idbManager.getSettings();

console.log(`Current settings: ${JSON.stringify(settings)}`);
```

***
***

#### **2i. getStore\<StoreName extends keyof PaletteSchema\>(storeName: StoreName, mode: 'readonly' | 'readwrite')**

**Description**<br>
Retrieves a transaction object for the specified object store in IndexedDB, providing access in either 'readonly' or 'readwrite' mode.

**Parameters**<br>
1. storeName (keyof PaletteSchema)
	* the name of the object store to access.
2. mode ('readonly' | 'readwrite'):
	* the mode of the transaction.

**Returns**<br>
a Promise resolving to an IDBPObjectStore for the specified store and mode.

**How It Works**<br>
1. Opens a transaction for the given store in the specified mode.
2. Returns the objectStore instance for further operations.

**Usage Example**<br>
```
const store = await idbManager.getStore('settings', 'readonly');
```

***
***

#### **2j. initializeDB(): Promise\<void\>**

**Description**<br>
Initializes the IndexedDB instance, ensuring that the default settings are stored if they do not already exist.

**How It Works**<br>
1. Awaits the dbPromise to ensure the database connection is established.
2. Checks for the existence of default settings.
3. Inserts default settings if they are missing.

**Usage**<br>
This method is called internally during the setup of IDBManager.

***
***

#### **2k. renderPalette\(tableId: string): Promise\<void | null\>**

**Description**<br>
Renders a palette table into the DOM based on a palette stored in IndexedDB.

**Parameters**<br>
1. tableId (string)
	* The ID of the palette to render.

**How It Works**<br>
1. Retrieves the palette using the getTable method.
2. Locates the DOM element with the ID palette-row.
3. Clears the contents of palette-row and appends the generated palette table.

**Returns**<br>
void if the rendering is successful, or null if an error occurs.

**Usage Example**<br>
```
await idbManager.renderPalette('palette_1');
```

***
***

#### 2l. **resetDatabase\(\): Promise\<void | null\>**

**Description**<br>
Clears all data from IndexedDB and resets it to default settings.

**How It Works**<br>
1. Iterates through all object stores in the database and clears their data.
2. Reinitializes default settings in the SETTINGS store.

**Returns**<br>
void if the operation is successful, or null if an error occurs.

**Usage Example**<br>
```
await idbManager.resetDatabase();
```

***
***

#### **2m. saveData\<T\>(storeName: keyof PaletteSchema, key: string, data: T, oldValue?: T): Promise\<void | null\>**

**Description**<br>
Saves data to a specified store in IndexedDB, logging the mutation.

**Parameters**<br>
1. storeName (keyof PaletteSchema)
	* the name of the store to update.
2. key (string)
	* the key under which the data is stored.
3. data (T)
	* the data to save.
4. oldValue (T | undefined)
	* the previous value of the data, used for logging.

**How It Works**<br>
1. Opens a transaction in 'readwrite' mode.
2. Updates the store with the new data.
3. Logs the mutation.

**Returns**<br>
void if the operation is successful, or null if an error occurs.

**Usage Example**<br>
```
await idbManager.saveData('settings', 'appSettings', { debug: true });
```

***
***

#### **2n. savePalette\(id: string, newPalette: StoredPalette\): Promise\<void | null\>**

**Description**<br>
Saves a palette to the tables object store in IndexedDB.

**Parameters**<br>
1. id (string)
	* the ID of the palette.
2. newPalette (StoredPalette)
	* the palette data to store.

**How It Works**<br>
1. Retrieves the tables store in 'readwrite' mode.
2. Saves the palette data under the given ID.

**Returns**<br>
void if the operation is successful, or null if an error occurs.

**Usage Example**<br>
```
await idbManager.savePalette('palette_2', newPalette);

```

***
***

#### **2o. savePaletteToDB\(type: string, items: PaletteItem[], baseColor: HSL, numBoxes: number, enableAlpha: boolean, limitDark: boolean, limitGray: boolean, limitLight: boolean): Promise\<Palette | null\>**

**Description**<br>
Creates a new palette object and saves it to IndexedDB under the tables store.

**Parameters**<br>
1. type (string)
	the type of palette being saved.
2. items (PaletteItem[])
	the list of items in the palette.
3. baseColor (HSL)
	the base color used to generate the palette.
4. numBoxes (number)
	* the number of boxes or items in the palette.
5. enableAlpha (boolean)
	whether alpha channel is enabled.
6. limitDark (boolean)
	whether dark colors are limited.
7. limitGray (boolean)
	whether gray colors are limited.
8. limitLight (boolean)
	whether light colors are limited.

**Returns**<br>
a Promise resolving to the newly created palette object, or null if an error occurs.

**How It Works**<br>
1. Calls createPaletteObject to construct a new palette object.
2. Validates the palette ID format (type_number).
3. Saves the palette object using savePalette.
4. Returns the newly created palette object.

**Usage Example**<br>
```
const newPalette = await idbManager.savePaletteToDB(
  'complementary',
  items,
  baseColor,
  5,
  true,
  true,
  false,
  true
);

```

***
***

#### **2p. saveSettings\(newSettings: Settings\): Promise\<void | null\>**

**Description**<br>
Updates the application's settings in IndexedDB under the SETTINGS store.

**Parameters**<br>
1. newSettings (Settings)
	* The new settings to be saved.

**Returns**<br>
a Promise resolving to void if successful, or null if an error occurs.

**How It Works**<br>
1. Calls saveData to store the new settings in the SETTINGS store.
2. Logs the update if mode.quiet is disabled.

**Usage Example**<br>
```
await idbManager.saveSettings({
	debug: true,
	verbose: false,
	quiet: true
});
```

***
***

#### **2q. updateEntryInPalette\(tableID: string, entryIndex: number, newEntry: PaletteItem\): Promise\<void | null\>**

**Description**<br>
Updates a specific entry in a palette stored in IndexedDB.

**Parameters**<br>
1. tableID (string)
	* the ID of the palette to be updated.
2. entryIndex (number)
	the index of the entry to update.
3, newEntry (PaletteItem)
	the new entry to replace the existing one.

**Returns**<br>
a Promise resolving to void if successful, or null if an error occurs.

**How It Works**<br>
1,. Retrieves the palette with the specified tableID using getTable.
2. Verifies the existence of the palette and the specified entry index.
3. Updates the specified entry in the palette.
4. Saves the updated palette back to IndexedDB using saveData.
5. Logs the mutation with details of the update.

**Error Handling**<br>
1. Throws an error if the palette or the entry does not exist and gracefulErrors is disabled.
2. Logs an error and continues if gracefulErrors is enabled.

**Usage Example**<br>
```
await idbManager.updateEntryInPalette('palette_2', 3, {
  cssStrings: { hexCSSString: '#ff5733' },
  metadata: { name: 'Bright Orange' }
});

```

***
***

#### **2r. deleteDatabase\(\): Promise\<void\>**

**Description**<br>
Deletes the IndexedDB database used by the application. This is useful for clearing all stored data, typically for debugging, resetting the application state, or handling corrupted data. If the database does not exist, the method logs a message and exits gracefully.

**Returns**<br>
a Promise resolving to void.

**How It Works**<br>
1. Checks if the database exists:
	 * Opens the database and resolves a boolean indicating its existence.
2. If the database exists:
    * Attempts to delete it using indexedDB.deleteDatabase(dbName).
    * Handles success, error, and blocked events:
        * Logs success if the deletion completes.
        * Logs an error if the deletion fails.
        * Logs a warning if the deletion is blocked due to open connections.
3. If the database does not exist:
    * Logs a message indicating that the database was not found.

**Error Handling**<br>
* Errors are handled via the handleAsync utility.
* Any exceptions or issues during the deletion process are logged and re-thrown.

**Usage Example**<br>
```
const idbManager = await IDBManager.createInstance();

try {
    await idbManager.deleteDatabase();
    console.log('Database successfully deleted.');
} catch (error) {
    console.error('Failed to delete the database:', error);
}

```

**Related Methods**<br>
* resetDatabase(): Resets the database by clearing all object stores and reinitializing default settings.

***
***
***

### 3. Private Methods

***
***

#### **3a. debugError\(context: string, error: unknown\): void**

**Description**<br>
Logs an error message to the console if errorLogs mode is enabled. Formats the error message based on the error type.

**Parameters**<br>
1. context (string)
	describes where the error occurred.
2. error (unknown)
	the error object or message to be logged.

**How It Works**<br>
1. Checks if errorLogs mode is enabled.
2. If the error is an instance of Error, extracts the message. Otherwise, converts the error to a string.
3. Calls the log method to log the error as an error level message.

***
***

#### **3b. formatLogMessage\(action: string, details: Record\<string, unknown\>\): string**

**Description**<br>
Formats a log message with a timestamp, action, and additional details.

**Parameters**<br>
1. action (string)
	the action or log level.
2. details \(Record\<string, unknown\>\)
	additional details about the log.

**Returns**<br>
a formatted log message as a string.

**Example**<br>
```
// Output: "[2025-01-12T12:34:56.789Z] Action: SAVE, Details: {"key":"value"}"

const message = this.formatLogMessage('SAVE', { key: 'value' });
```

***
***

#### **3c. getDB\(\): Promise\<PaletteDB\>**

**Description**<br>
Returns the dbPromise, resolving to the PaletteDB instance.

**Returns**<br>
a Promise resolving to the PaletteDB instance.

***
***

#### **3d. getDefaultKey\(key: keyof typeof this.DEFAULT_KEYS\): string**

**Description**<br>
Retrieves the default key value from DEFAULT_KEYS.

**Parameters**<br>
1. key (keyof typeof this.DEFAULT_KEYS)
	* the key to retrieve.

**Returns**<br>
the corresponding string value for the provided key.

***
***

#### **3e. getStoreName\(storeKey: keyof typeof this.STORE_NAMES\): string**

**Description**<br>
Retrieves the store name from STORE_NAMES.

**Parameters**<br>
1. storeKey (keyof typeof this.STORE_NAMES)
	the store key to retrieve.

**Returns**<br>
the corresponding string value for the provided store key.

***
***

#### **3f. getTable\(id: string\): Promise\<StoredPalette | null\>**

**Description**<br>
Fetches a stored palette from the tables store by its ID.

**Parameters**<br>
1. id (string)
	* the ID of the table to fetch.

**Returns**<br>
a Promise resolving to the StoredPalette object if found, or null if not.

**How It Works**<br>
1. Retrieves the database instance using getDB.
2. Fetches the table from the tables store using the ID.
3. Logs a warning if the table is not found and warnLogs mode is enabled.

***
***

#### **3g. handleAsync\<T\>\(action: \(\) => Promise\<T\>, errorMessage: string, context?: Record\<string, unknown\>\): Promise\<T | null\>**

**Description**<br>
A utility method for handling async operations with error logging and context support.

**Parameters**<br>
1. action (() => Promise<T>)
	* the asynchronous action to execute.
2. errorMessage (string)
	* a descriptive error message for logging.
3. context (Record<string, unknown>)
	* optional context to include in error logs.

**Returns**<br>
a Promise resolving to the result of the action, or null if an error occurs.

**How It Works**<br>
1. Executes the provided action asynchronously.
2. Catches any errors, logs them with context if provided, and rethrows the error.

***
***

#### **3h. log\(message: string, level: 'info' \| 'warn' \| 'error' = 'info'\): void**

**Description**<br>
Logs a message to the console at the specified level, applying conditional logging based on mode settings.

**Parameters**<br>
1. message (string)
	* the message to log.
2. level \('info' \| 'warn' \| 'error'\)
	the log level. Defaults to 'info'.

**How It Works**<br>
1. Checks the quiet and mode settings to determine if logging is allowed.
2. Formats the message using formatLogMessage.
3. Logs the message to the console at the specified level.

***
***

#### **3i. logMutation\(log: MutationLog\): Promise\<void \| null\>**

**Description**<br>
Logs a mutation to the mutations store in IndexedDB.

**Parameters**<br>
1. log (MutationLog)
	* the mutation log object to store.

**Returns**<br>
a Promise resolving to void if successful, or null if an error occurs.

**How It Works**<br>
1. Retrieves the database instance using getDB.
2. Adds the mutation log to the mutations store.
3. Logs the mutation details if quiet mode is disabled.

***
***

#### **3j. resolveKey\<K extends keyof typeof this.DEFAULT_KEYS\>\(key: K\): string**

**Description**<br>
Resolves a key to its corresponding value in DEFAULT_KEYS.

**Parameters**<br>
1. key \(K\)
	* the key to resolve

**Returns**<br>
the resolved string value.

***
***

#### **3k. resolveStoreName\<S extends keyof typeof this.STORE_NAMES\>\(store: S\): string**

**Description**<br>
Resolves a store name to its corresponding value in STORE_NAMES.

**Parameters**<br>
1. store (S)
	the store key to resolve.

**Returns**<br>
the resolved string value.

***
***

#### **3l. updateCurrentPaletteID\(newID: number\): Promise\<void | null\>**

**Description**<br>
Updates the current palette ID in the settings store of IndexedDB.

**Parameters**<br>
1. newID (number)
	* the new palette ID to save.

**Returns**<br>
a Promise that resolves to void if the operation is successful, or null if an error occurs.

**How It Works**<br>
1. Initiates a transaction on the settings store in readwrite mode.
2. Logs the intended update if debug mode is enabled.
3. Updates the lastPaletteID in the appSettings entry of the settings store.
4. Completes the transaction and logs the success message if quiet mode is disabled.

**Example**<br>

```
await updateCurrentPaletteID(42); // updates the palette ID to 42

```

***
***

### **[Return to Top](#table-of-contents)**

***
