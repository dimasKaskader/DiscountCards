USE project_best_price_db;

DELIMITER //
create procedure `clients_for_push` (in industry_id int, in company_id int, in spent_from int, in spent_to int)
begin
	if company_id is null then
		drop table if exists test;
		CREATE TEMPORARY TABLE IF NOT EXISTS test AS (
		select id_user as id, sum(price) as spent 
		from user_history_purchases
		inner join company on user_history_purchases.id_company = company.id
		inner join industry on company.id_industry = industry.id
		where industry.id = industry_id
		group by id_user
        order by spent desc
        );
		ALTER TABLE test ADD cost float;
	else
		drop table if exists test;
		CREATE TEMPORARY TABLE IF NOT EXISTS test AS (
		select id_user as id, sum(price) as spent 
		from user_history_purchases
		inner join company on user_history_purchases.id_company = company.id
		where company.id = company_id
		group by id_user
        order by spent desc
		);
		ALTER TABLE test ADD cost float;
	end if;
    
	SET @max_spent = (select spent from test
	LIMIT 1);
    
    update test set cost = power(spent / @max_spent, 2) * 5;
    select id, cost from test where spent >= spent_from and spent <= spent_to;
end //
DELIMITER ;

DELIMITER //
create procedure `spending_per_industry` (in user_id int)
begin
	select max(user.id) as id, max(industry.title) as industry, sum(price) as price, sum(price * discount) as discount from user 
	inner join user_history_purchases on user.id = user_history_purchases.id_user
	inner join company on user_history_purchases.id_company = company.id
	inner join industry on company.id_industry = industry.id
    inner join discount_status on id_discount = discount_status.id
	where user.id=user_id
	group by industry.id;
end //
DELIMITER ;

DELIMITER //
create procedure `clients_in_industry` (in industry_id int, in company_id int, in update_temporary bool, in groups_ int)
begin
	if company_id is null then
		if update_temporary then
			drop table if exists test;
			CREATE TEMPORARY TABLE IF NOT EXISTS test AS (
			select id_user as id, sum(price) as spent 
			from user_history_purchases
			inner join company on user_history_purchases.id_company = company.id
			inner join industry on company.id_industry = industry.id
			where industry.id = industry_id
			group by id_user
			order by spent desc);
			ALTER TABLE test ADD cost float;
		end if;
	else
        if update_temporary then
			drop table if exists test;
			CREATE TEMPORARY TABLE IF NOT EXISTS test AS (
			select id_user as id, sum(price) as spent 
			from user_history_purchases
			inner join company on user_history_purchases.id_company = company.id
			where company.id = company_id
			group by id_user
			order by spent desc);
			ALTER TABLE test ADD cost float;
		end if;
	end if;
    
	SET @max_spent = (select spent from test
	LIMIT 1);

	SET @min_spent = (select spent from test
	order by spent
	LIMIT 1);
    
    update test set cost = power(spent / @max_spent, 2) * 5;
    
	SET @group_size = (select (@max_spent - @min_spent) / groups_);

	select floor((spent - @min_spent) / @group_size) as gr, count(*) as amount, min(spent) as spent_from, max(spent) as spent_to, sum(cost) as cost from test
	group by gr;
end//
DELIMITER ;

DELIMITER //
create procedure `company_balance` (in company_id int)
begin
	select company_balance, purchase_time
	from user_history_purchases
	inner join company on user_history_purchases.id_company = company.id
    inner join
	(
	  select max(purchase_time) as max 
	  from user_history_purchases
      where id_company = company_id
	  group by date(purchase_time)
	) a2
	on purchase_time = a2.max
	where id_company = company_id
    union all
	select company_balance, datetime as purchase_time
	from balance_payment
	inner join company on balance_payment.id_company = company.id
	where id_company = company_id
	order by purchase_time;
end//
DELIMITER ;

DELIMITER //
create procedure `user_balance` (in user_id int)
begin
	select user_balance, purchase_time
	from user_history_purchases
	inner join user on user_history_purchases.id_user = user.id
    inner join
	(
	  select max(purchase_time) as max 
	  from user_history_purchases
      where id_user = user_id
	  group by date(purchase_time)
	) a2
	on purchase_time = a2.max
	where id_user = user_id
	order by purchase_time;
end//
DELIMITER ;

DELIMITER //
create procedure `company_history_purchases` (in company_id int, in period int)
begin
	select sum(price) as sum, date(max(purchase_time)) as purchase_time
    from user_history_purchases
    where id_company = company_id and purchase_time > now() - interval period day
    group by day(purchase_time)
    order by purchase_time;
end//
DELIMITER ;