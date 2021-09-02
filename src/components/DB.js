export function setUserInfo(id, pw) {
    localStorage.setItem(id, pw);
}

export function checkUserInfo(id, pw) {
    const dbPw = localStorage.getItem(id);
    if (dbPw === pw) return true;
    return false;
}
