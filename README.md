# Penjelasan

Berikut adalah hal-hal yang saya kerjakan dan apa saja yang saya peroleh.

## Tools
Tools yang saya gunakan adalah :
- DigitalOcean (cloud provider)
- Jenkins

## Membuat Virtual Machine
Saya membuat Virtual Machine di DigitalOcean dan saya gunakan untuk Jenkins server.
## Instalasi Jenkins
Saya melakukan instalasi Jenkins menggunakan debian/ubuntu packages dan mengikuti petunjuk sesuai pada dokumentasi jenkins di URL ini
`https://www.jenkins.io/doc/book/installing/linux/`. Kemudian melakukan post-installation seperti pada dokumentasi jenkins dan membuat user administrator.

## Menghubungkan Git
Melakukan instalasi plugin git pada jenkins untuk mengambil kode program yang terdapat pada git. Buka menu `Manage Jenkins -> Manage Plugin` kemudian pilih "Available plugins" dan cari "Git" kemudian install. Setelah terinstal kemudian membuat credential SSH yang digunakan untuk menghubungkan jenkins ke github. Melakukan generate SSH key pair menggunakan perintah `ssh-keygen`. Setelah SSH key pair terbuat saya menaruh public key pada akses akun github saya pada menu `settings -> SSH and GPG keys (Access) -> New SSH key`. Kemudian membuat credentials di jenkins pada menu `Manage Jenkins -> Credentials -> System -> Global credentials (unrestricted) -> Add Credentials`. Pilih opsi **Kind**  dengan pilihan **SSH Username with private key** . Kemudian memasukkan ID untuk id dari credential yang akan digunakan. Memasukkan username dari github yang saya gunakan. Checklist pilihan **Enter directly** pada opsi **Private Key** kemudian masukkan private key dari SSH key pair yang telah dibuat. Kemudian save.

## Instalasi MongoDB
Melakukan instalasi MongoDB pada Virtual Machine mengikuti tutorial dari [link ini](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04). Akses MongoDB menggunakan perintah `mongo` kemudian membuat database baru menggunakan perintah `use nodejs` dimana "nodejs" adalah nama database yang akan dibuat. Kemudian tambahkan suatu data agar database "nodejs" terbuat". Contoh masukkan perintah `db.user.insert({name: "Fawwaz", age: 23})`. Setelah database terbuat selanjutnya adalah melakukan konfigurasi agar MongoDB bisa diakses secara public. Edit file `/etc/mongod.conf` pada Virtual Machine. Cari bagian **network interface** kemudian tambahkan value dari **bindIp** dengan IP public dari Virtual Machine. Kemudian simpan dan restart MongoDB menggunakan perintah `sudo systemctl restart mongod`. 

## Instalasi NodeJS
Melakukan instalasi plugin NodeJS pada jenkins untuk melakukan eksekusi script NodeJS sebagai sebuah build step. Buka menu `Manage Jenkins -> Manage Plugin` kemudian pilih "Available plugins" dan cari "NodeJS" kemudian install. Setelah terinstall kemudian melakukan konfigurasi pada menu `Manage Jenkins -> Global Tool Configuration` cari "NodeJS" kemudian tambahkan NodeJS. Masukkan nama dan checklist "Install automatically" kemudian pilih versi "NodeJS 10.19.0". Setelah itu save.

## Membuat Credentials Docker Hub
Membuat Access Tokens di akun docker hub dengan membuka menu user dengan meng-klik gambar atau nama profil akun kemudian pilih "Account Settings" kemudian "security" setelah itu klik tombol "New Access Token". Token yang telah dibuat bisa digunakan sebagai password dari akun docker hub. Setelah Access Token terbuat kemudian membuat credentials di Jenkins pada menu `Manage Jenkins -> Credentials -> System -> Global credentials (unrestricted) -> Add Credentials`. Pilih opsi **Kind**  dengan pilihan ** Username with password** . kemudian masukkan Username dari akun docker hub dan masukkan Password berupa Access Token yang telah dibuat. Kemudian memasukkan ID untuk id dari credential yang akan digunakan. Kemudian save.

## Membuat Dockerfile
Membuat Dockerfile untuk melakukan build sebuah container image. Dockerfile berisi seperti pada [file ini](./Dockerfile).
```
FROM node:10.19.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g bower

WORKDIR /app/public

RUN bower install

WORKDIR /app/bin

EXPOSE 4000
CMD [ "node", "www" ]
```

## Membuat Job
Membuat job baru pada menu 
`Dashboard -> New Item` kemudian memasukkan nama untuk job yang akan dibuat dan pilih tipe **Pipeline**. Kemudian melakukan konfigurasi. Pada bagian pipeline pilih **Pipeline script from SCM** pada opsi Definition dan pilih **Git** pada opsi SCM. Kemudian masukkan Repository URL yang telah dibuat dan credetials yang telah dibuat untung menghubungkan ke github.

## Membuat Pipeline
Membuat file **[Jenkinsfile](./Jenkinsfile)** di repository github. File tersebut berisi pipeline script yang digunakan untuk menjalankan sebuah job. File Jenkinsfile berisi seperti pada [file ini](./Jenkinsfile).

```
pipeline {
    agent any
    
    tools {nodejs "nodejs"}

    environment {
		DOCKERHUB_CREDENTIALS=credentials('docker-hub')
	}
    
    stages {            
        stage('Build') {
            steps {
                    sh 'npm install'
                    echo 'npm install done'
                    sh 'docker build -t fawwazzuhdan/nodejs:latest .'
            }
        }

        stage('Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push') {
            steps {
                sh 'docker push fawwazzuhdan/nodejs:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker stop app-nodejs || true && docker rm app-nodejs || true'
                sh 'docker run --name=app-nodejs --rm -it -d fawwazzuhdan/nodejs:latest'
            }
        }
    }
}
```

Pada bagian 

```
tools {nodejs "nodejs"}
``` 

digunakan untuk memanggil tools nodejs yang telah dibuat. Pada bagian 

```
environment {
    DOCKERHUB_CREDENTIALS=credentials('docker-hub')
}
```

digunakan untuk menambahkan environment pada pipeline berupa credentials docker hub yang digunakan untuk melakukan autentikasi docker hub. Pada bagian

```
stage('Build') {
    steps {
            sh 'npm install'
            echo 'npm install done'
            sh 'docker build -t fawwazzuhdan/nodejs:latest .'
    }
}
```

digunakan untuk melakukan build sebuah container image. Kemudian melakukan login ke akun docker hub pada bagian di bawah ini.

```
stage('Login') {
    steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
    }
}
```

Kemudian container image yang telah dibuild dipush ke docker hub pada bagian di bawah ini.

```
stage('Push') {
    steps {
        sh 'docker push fawwazzuhdan/nodejs:latest'
    }
}
```

Pada bagian
```
stage('Deploy') {
    steps {
        sh 'docker stop app-nodejs || true && docker rm app-nodejs || true'
        sh 'docker run --name=app-nodejs --rm -it -d fawwazzuhdan/nodejs:latest'
    }
}
```
digunakan untuk menghapus docker sebelumnya jika ada kemudian menjalankan docker baru pada Virtual machine.
## Tambahan
Apa yang telah saya kerjakan hanya membuat app simple menggunakan boiler plate nodejs, build service, build container image, dan store container image ke registry. Untuk service yang bisa diakses dari public menggunakan DNS domain saya hanya menjalankan container image yang telah dibuild pada Virtual Machine yang saya gunakan kemudian membuat konfigurasi web server nginx menggunakan proxy_pass dengan URL https://nodejs.hariangaming.com/. Konfigurasi nginx sebagai berikut
```
server {
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Kemudian saya men-drop semua akses yang menuju port app yaitu 4000 kecuali akses dari Virtual Machine yang saya gunakan menggunakan "iptables" dan perintah yang digunakan adalah
```
iptables -A INPUT -p tcp -s localhost --dport 4000 -j ACCEPT
iptables -A INPUT -p tcp --dport 4000 -j DROP
```
Untuk konfigurasi DNS saya menggunakan Cloudflare dengan menambahkan subdomain "**nodejs.hariangaming.com**" dan menggunakan SSL.

### Ucapan Terima Kasih
Saya ucapkan terima kasih atas tes dan waktu yang telah diberikan. Walaupun saya cukup mengalami kesulitan karena baru belajar menggunakan jenkins tetapi saya bersyukur dengan adanya tes ini saya bisa belajar menggunakan jenkins. Harapan saya kedepannya semoga saya bisa menambah kemampuan yang lain yang berkaitan tentang DevOps. Terima kasih.