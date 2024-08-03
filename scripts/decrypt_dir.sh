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

# Extract the decompressed archive
tar -xzvf "$ARCHIVE"

# Optionally, prompt to remove the decrypted tar.gz file
read -p "Do you want to delete the decrypted archive ($ARCHIVE)? (y/n): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    rm "$ARCHIVE"
    echo "Decrypted archive deleted."
else
    echo "Decrypted archive kept."
fi

read -p "unlock_dir.sh execution complete"
