echo "Starting build"
npm run build
mv build/server/src/index.js build/server/src/index.mjs # This is necessary for PM2
echo "Build complete"

HIKU_ADDRESS=${HIKU_USER}@hiku.ca

ssh ${HIKU_ADDRESS} -f pm2 stop hiku
echo "Server stopped."

ssh ${HIKU_ADDRESS} -f rm -rf ~/hiku/build
scp -r ./build ${HIKU_ADDRESS}:~/hiku
scp ./package.json ${HIKU_ADDRESS}:~/hiku
scp ./.env.example ${HIKU_ADDRESS}:~/hiku
echo "Files copied to server"
echo "Please install dependencies manually if necessary by logging in and running npm install --production."
echo "If any database changes were made please log into the server and run npx prisma migrate deploy."

ssh ${HIKU_ADDRESS} -f pm2 start hiku
echo "Service started on server."
echo "The deploy was successful!"