SELECT json_group_object(
  groups,
  (SELECT json_group_array(subgroups)
  FROM (SELECT DISTINCT subgroups 
        FROM openmoji o2 WHERE o2.groups = o1.groups))
) AS tree
FROM (SELECT DISTINCT groups FROM openmoji) o1;