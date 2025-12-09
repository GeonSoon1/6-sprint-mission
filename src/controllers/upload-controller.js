// TODO) Upload-Controller: 이미지 요청 처리
export const uploadController = {
  // ?) 이미지 업로드 응답
  image(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '업로드된 파일이 없습니다.',
      });
    }
    
    return res.status(201).json({
      success: true,
      path: `/uploads/${req.file.filename}`,
    });
  },
};
