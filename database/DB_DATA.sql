
insert into user (first_name, last_name, reg_date) values ('Вася', 'Петин', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Петя', 'Васин', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Ываыва', 'Пеппптя', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Авыап', 'Пвапетя', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Цуква', 'Пеаптя', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Цукsdfsdва', 'Пеаsfdfптя', '2019-03-16');
insert into user (first_name, last_name, reg_date) values ('Цуdfsdfква', 'Пеsdfsdаптя', '2019-03-16');

insert into user_web (id, password, last_login, email) values (1, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (2, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (3, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (4, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (5, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (6, '', '2019-03-15', null);
insert into user_web (id, password, last_login, email) values (7, '', '2019-03-15', null);

insert into industry (title) values ('продукты');
insert into industry (title) values ('видегеймнигг');
insert into industry (title) values ('вкоджимблинг');
insert into industry (title) values ('здоровье');
insert into industry (title) values ('кал');

insert into company (id, title, logo, icon, description, id_industry, reg_date) values (1, 'Бурят', '', '', '', 1, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (2, 'Бурят', '', '', '', 1, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (3, 'Бурят', '', '', '', 2, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (4, 'Бурят', '', '', '', 3, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (5, 'Бурят', '', '', '', 4, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (6, 'Бурят', '', '', '', 4, '2019-03-15');
insert into company (id, title, logo, icon, description, id_industry, reg_date) values (7, 'Бурят', '', '', '', 5, '2019-03-15');

insert into discount_status (id_company, name, threshold_sum, discount, city) values (1, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (2, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (3, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (4, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (5, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (6, '', 100, 0.05, 1);
insert into discount_status (id_company, name, threshold_sum, discount, city) values (7, '', 100, 0.05, 1);

insert into cashier (id_user, id_company, is_confirmed) values (1, 1, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 2, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 3, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 4, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 5, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 6, true);
insert into cashier (id_user, id_company, is_confirmed) values (1, 7, true);

insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (1, 1, 1, 1, '2019-03-15', 5000, 0.5, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (2, 1, 1, 1, '2019-03-15', 1000, 0.55, 90);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (3, 2, 2, 2, '2019-03-15', 500, 0.5, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (4, 2, 2, 2, '2019-03-15', 51000, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (4, 2, 2, 2, '2019-03-15', 10000, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (5, 2, 2, 2, '2019-03-15', 56464, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (5, 2, 2, 2, '2019-03-15', 5121, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (6, 2, 2, 2, '2019-03-15', 781, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (7, 2, 2, 2, '2019-03-15', 6741, 0.57, 100);
insert into user_history_purchases (id_user, id_company, id_discount, id_cashier, purchase_time, price, user_balance, company_balance) values (7, 2, 2, 2, '2019-03-15', 5111, 0.57, 100);

insert into balance_payment (id_company, payment_amount, company_balance, datetime) values (1, 100, 300, now())




