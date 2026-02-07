# 이미지 업로드 명령어
curl -X POST http://[IP_ADDRESS]/images/upload -H "Content-Type: multipart/form-data" -F "image=@[file_path]"

# 예시
curl.exe -X POST http://13.125.62.54/images/upload -H "Content-Type: multipart/form-data" -F "image=@C:\Users\user\Desktop\hongkong.jpg"

