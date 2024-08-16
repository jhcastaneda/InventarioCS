-- DROP FUNCTION public.editproduct(int4, varchar, varchar, numeric, int4);

CREATE OR REPLACE FUNCTION public.editproduct(p_id integer, p_name character varying, p_description character varying, p_price numeric, p_amount integer,p_check character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public."Products"
    SET
        "name" = p_name,
        "description" = p_description,
        "price" = p_price,
        "amount" = p_amount,
        "check" = p_check
    WHERE
        "id" = p_id;
END;
$function$
;



-- DROP FUNCTION public.createproduct(varchar, varchar, numeric, int4);

CREATE OR REPLACE FUNCTION public.createproduct(p_name character varying, p_description character varying, p_price numeric, p_amount integer, p_check character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public."Products" ("name", "description", "price", "amount","check")
    VALUES (p_name, p_description, p_price, p_amount, p_check);
END;
$function$
;