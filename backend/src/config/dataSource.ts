import { DataSource } from "typeorm";
import { User } from "../model/User";
import { VerifyCode } from "../model/VerifyCode";
import { Interests } from "../model/Interests";

const dataSource = new DataSource({
    type : "postgres",
    host : "dpg-co40cmv79t8c738stbg0-a.oregon-postgres.render.com",
    port : 5432,
    username : "turnover_user",
    password : "5Z5hxXwW9IanZKcidx6FvxGQaJbcoHcF",
    database : "turnover",
    logging : true,
    synchronize : true,
    ssl: true,
    entities : [
        User, VerifyCode, Interests
    ]
})
export default dataSource;
