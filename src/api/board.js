import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 게시글 목록 조회
function listArticle(param, success, fail) {
  local.get(`/boards`, { params: param }).then(success).catch(fail);
}

// 게시글 상세 조회
function detailArticle(id, success, fail) {
  local.get(`/boards/${id}`).then(success).catch(fail);
}

// 게시글 작성
function registArticle(article, success, fail) {
  local.post(`/boards`, article).then(success).catch(fail);
}

// GET 요청 - 수정할 게시글 조회
function getModifyArticle(id, success, fail) {
  local.get(`/boards/modify/${id}`).then(success).catch(fail);
}

// POST 요청 - 게시글 수정
function modifyArticle(article, success, fail) {
  const token = JSON.parse(localStorage.getItem("user")).token;
  local.post(`/boards/modify/${article.id}`, article, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(success)
  .catch(fail);
}

// 게시글 삭제
function deleteArticle(id, success, fail) {
  local.delete(`/boards/${id}`)
    .then(success)
    .catch(fail);
}

export {
  listArticle,
  detailArticle,
  registArticle,
  getModifyArticle,
  modifyArticle,
  deleteArticle,
};