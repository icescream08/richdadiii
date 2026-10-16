#!/usr/bin/env bash
# RichDNA RLS penetration check — re-run after every database change.
# Uses only the public (publishable) key, exactly what any visitor has.
# Every probe must be refused; the script exits 1 if anything leaks.
# Usage: bash tests/rls-penetration.sh

U=https://dgxmjbsofetwpcthiddf.supabase.co
K=sb_publishable__nrvO5EKbJdfsFY_c_oFdg_KEVmAjVc
T="$U/rest/v1/richdna_submissions"
fail=0

check() { # name, expected-code-regex, actual-code, body
  if [[ "$3" =~ ^($2)$ ]]; then echo "PASS  $1 ($3)"; else echo "FAIL  $1 (got $3) $4"; fail=1; fi
}
req() { curl -s -o /tmp/rls_body -w "%{http_code}" "$@" -H "apikey: $K"; }

VALID='"first_name":"Rls","last_name":"Probe","email":"rls@probe.test","birthdate":"1990-01-01","gender":"","western_sign":"Capricorn","chinese_animal":"Horse","life_path_number":1,"life_path_title":"The Pioneer","receiving_top":"Quality Time","giving_top":"Quality Time","answers":{}'
SCORES='"receiving_scores":[1,2,3,4,5],"giving_scores":[1,2,3,4,5]'

c=$(req "$T?select=*");                                   check "anon cannot list rows"            "401|403"     "$c" "$(cat /tmp/rls_body)"
c=$(req "$T?select=count");                               check "anon cannot count rows"           "401|403"     "$c" "$(cat /tmp/rls_body)"
c=$(req -X PATCH "$T?id=not.is.null" -H "Content-Type: application/json" -d '{"first_name":"x"}')
                                                          check "anon cannot update rows"          "401|403"     "$c" "$(cat /tmp/rls_body)"
c=$(req -X DELETE "$T?id=not.is.null");                   check "anon cannot delete rows"          "401|403"     "$c" "$(cat /tmp/rls_body)"
c=$(req -X POST "$T" -H "Content-Type: application/json" -H "Prefer: return=representation" \
     -d "{\"id\":\"00000000-0000-4000-8000-0000000000a1\",$VALID,$SCORES,\"gender\":\"x\"}")
                                                          check "insert cannot read back (return=representation) / bad gender rejected" "400|401|403" "$c" "$(cat /tmp/rls_body)"
c=$(req -X POST "$T" -H "Content-Type: application/json" -H "Prefer: return=minimal" \
     -d "{\"id\":\"00000000-0000-4000-8000-0000000000a2\",\"created_at\":\"2000-01-01T00:00:00Z\",$VALID,$SCORES}")
                                                          check "anon cannot set created_at"       "401|403"     "$c" "$(cat /tmp/rls_body)"
c=$(req -X POST "$T" -H "Content-Type: application/json" -H "Prefer: return=minimal" \
     -d "{\"id\":\"00000000-0000-4000-8000-0000000000a3\",$VALID,\"receiving_scores\":{},\"giving_scores\":[1,2,3,4,5]}")
                                                          check "malformed scores rejected"        "400"         "$c" "$(cat /tmp/rls_body)"
c=$(req -X POST "$T" -H "Content-Type: application/json" -H "Prefer: return=minimal" \
     -d "{\"id\":\"00000000-0000-4000-8000-0000000000a4\",$VALID,$SCORES,\"life_path_number\":13}")
                                                          check "invalid life path rejected"       "400"         "$c" "$(cat /tmp/rls_body)"
c=$(req -X POST "$U/auth/v1/signup" -H "Content-Type: application/json" -d '{"email":"rls-probe@probe.test","password":"Probe-123456-x"}')
                                                          check "public sign-up disabled"          "400|403|422" "$c" "$(cat /tmp/rls_body)"
c=$(req "$U/rest/v1/" );                                  check "schema listing not open to anon"  "401|403|404" "$c" "$(head -c 200 /tmp/rls_body)"

exit $fail
