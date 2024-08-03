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

# Compress the directory
tar -czvf "$ARCHIVE" "$DIR"

# Check if the encrypted archive already exists and find a new name if necessary
OUTPUT_ARCHIVE="$ENCRYPTED_ARCHIVE"
i=1
while [ -f "$OUTPUT_ARCHIVE" ]; do
    OUTPUT_ARCHIVE="${ENCRYPTED_ARCHIVE%.gpg}-$i.gpg"
    i=$((i + 1))
done

# Encrypt the compressed archive
gpg --output "$OUTPUT_ARCHIVE" --encrypt --recipient "$GPG_RECIPIENT" "$ARCHIVE"

# Check if the encryption was successful
if [ $? -eq 0 ]; then
    # Remove unencrypted directory and intermediate tar.gz archive
    rm -r "$DIR"
    echo "Original directory deleted."
    rm "$ARCHIVE"
else
    echo "Encryption failed."
    exit 1
fi

# Indicate completion
echo "lockDev.sh execution complete"