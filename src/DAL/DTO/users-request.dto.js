export default class UsersRequestDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
    this.username = user.username;
    this.age = user.age
    this.cart = user.cart
    this.role = user.role;
  }
}