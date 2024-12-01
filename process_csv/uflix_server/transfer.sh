rsync -avz --progress --exclude='target' --exclude='transfer.sh' --exclude='.git' --human-readable -e 'ssh -i ~/.ssh/gcloud' "$1/" henrik_zenkert@34.75.169.109:/home/henrik_zenkert/uflix_server

ssh -i ~/.ssh/gcloud henrik_zenkert@34.75.169.109 'sudo systemctl restart uflix_server && echo "server restarted"'
