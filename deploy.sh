echo "Starting build"
npm run build
echo "Build complete"

HIKU_ADDRESS=${HIKU_USER}@hiku.ca

ssh ${HIKU_ADDRESS} -f pm2 stop hiku
echo "Server stopped."

scp -r ./build ${HIKU_ADDRESS}:~/hiku
scp ./package.json ${HIKU_ADDRESS}:~/hiku
scp ./.env.example ${HIKU_ADDRESS}:~/hiku
echo "Files copied to server"
echo "Please install dependencies manually if necessary by logging in and running npm install --production."
echo "If any database changes were made please log into the server and run npx prisma migrate deploy."

ssh ${HIKU_ADDRESS} -f pm2 start hiku
echo "Service started on server