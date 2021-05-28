echo "Starting build"
npm run build

echo "Build complete"

HIKU_ADDRESS=${HIKU_USER}@hiku.ca

ssh ${HIKU_ADDRESS} -f pm2 stop hiku

echo "Server stopped."

scp -r ./build ${HIKU_ADDRESS}:~/hiku
scp ./package.json ${HIKU_ADDRESS}:~/hiku

echo "Files copied to server"
ssh ${HIKU_ADDRESS} -f npm install --production
ssh ${HIKU_ADDRESS} -f pm2 start hiku

echo "Service started on server"