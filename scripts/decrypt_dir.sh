#!/bin/sh


# Capture directory
CWD=$(dirname "$0")

# Debug: Print the current directory
echo "Current directory: $CWD"

# Load variables from .env
if [ -f "$CWD/.env" ]; then
    echo ".env file found in $CWD. Loading..."
    set -a
    source "$CWD/.env"
    set +a
else
    echo ".env file not found in $CWD. Exiting."
    exit 1
fi

# Debug: Print loaded variables
echo "DIR: $DIR"
echo "ARCHIVE: $ARCHIVE"
echo "ENCRYPTED_ARCHIVE: $ENCRYPTED_ARCHIVE"
echo "GPG_RECIPIENT: $GPG_RECIPIENT"

# Decrypt the archive
gpg --output "$ARCHIVE" --decrypt "$ENCRYPTED_ARCHIVE"

# Check if the decryption was successful
if [ $? -eq 0 ]; then
    # Check if the output directory already exists and find a new name if necessary
    OUTPUT_DIR="$DIR"
    i=1
    while [ -d "$OUTPUT_DIR" ]; do
        OUTPUT_DIR="${DIR}-$i"
        i=$((i + 1))
    done

    # Extract the decompressed archive
    tar -xzvf "$ARCHIVE" -C "$CWD"
    mv "$CWD/$DIR" "$OUTPUT_DIR"

    # Remove the input encrypted archive and intermediate tar.gz archive
    rm "$ENCRYPTED_ARCHIVE"
    echo "Encrypted archive deleted."
    rm "$ARCHIVE"
else
    echo "Decryption failed."
    exit 1
fi

# Indicate completion
echo "unlockDev.sh execution complete