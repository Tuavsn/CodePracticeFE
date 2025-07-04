export function stringToSlug(str: string) {
    // Chuyển tất cả các ký tự thành chữ thường
    str = str.toLowerCase();
 
    // Thay thế các ký tự đặc biệt tiếng Việt
    str = str.replace(/đ/g, 'd');
 
    // Loại bỏ dấu tiếng Việt
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 
    // Thay thế các ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
    str = str.replace(/[^a-z0-9\s-]/g, '');
 
    // Thay thế khoảng trắng hoặc dấu gạch ngang liên tiếp bằng một dấu gạch ngang
    str = str.trim().replace(/\s+/g, '-').replace(/-+/g, '-');
 
    return str;
}