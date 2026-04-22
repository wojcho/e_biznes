cd backend
./buildImage.sh
cd ..

cd frontend
./buildImage.sh
cd ..

docker compose up
