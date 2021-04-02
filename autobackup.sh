#!/bin/sh

delete_date=$(date +'%m-%d-%Y' -d "7 day ago")
delete_file="/home/churlyaev/mongoBackup/auto_backup_${delete_date}.archive"
if test -f "${delete_file}"; then
    echo "File for delete: ${delete_file} exists."
    rm $delete_file
fi

backup_date=$(date +'%m-%d-%Y')
backup_file="/home/churlyaev/mongoBackup/auto_backup_${backup_date}.archive"
echo "${backup_date}"
echo "${backup_file}"
mongodump --archive=$backup_file --gzip --db tfoms

# Add to crontab -e
# 0 1 * * * /home/churlyaev/mongoBackup/autobackup.sh

