#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
vec3 orig = vec3(0.0,0.0,0.0);
vec3 lightsource = vec3(0.0, 1.0, 0.7);
struct t_object
{
	vec3 pos;
	vec3 color;
	float radius;
	int type;
};
t_object objects[3];

bool ray_intersect(vec3 orig, vec3 dir, t_object obj, out float t0)
{
	vec3 L = obj.pos - orig;
	float tca = dot(L, dir);
	float d2 = dot(L,L) - dot(tca,tca);
	if (d2 > (obj.radius * obj.radius)) return false;
	float thc = sqrt(obj.radius * obj.radius - d2);
	t0       = tca - thc;
	float t1 = tca + thc;
	if (t0 < 0.0) t0 = t1;
	if (t0 < 0.0) return false;
	return true;
}

vec3 cast_ray(vec3 orig, vec3 dir, t_object objects[3]) {
	float sphere_dist = 10000.0;
	float t0;
	float diffuse_light_intensity = 0.0;
	vec3 normal;
	vec3 hit;
	vec3 color;
	if (ray_intersect(orig, dir, objects[0], t0)) {
		hit = orig + dir*t0;
		normal = hit - objects[0].pos;
		color = objects[0].color;
		float diffuse_light_intensity = 0.0;
		vec3 light_dir = lightsource - hit;
		diffuse_light_intensity = 1.5 * max(0.0, dot(light_dir,normal));
		return vec3(0.7882, 0.2471, 0.1137) * diffuse_light_intensity;
	}
	return vec3(0.2471, 0.8784, 0.902);
}


void main()
{
	objects[0].pos = vec3(0.0, 0.0, -1.0);
	objects[0].radius = 0.4;
	objects[0].color = vec3(1,0,0);

	float fov = 90.0;
	// float x = (2.0 *((gl_FragCoord.x   + 0.5)/(u_resolution.x  + 1.0)- 0.5)) * tan(90.0/2.0) * u_resolution.x/u_resolution.y;
	// float y =  -(2.0*((gl_FragCoord.y + 0.5)/(u_resolution.y - 1.5) - 0.5))*tan(90.0/2.0);
	float x  = (gl_FragCoord.x / (u_resolution.x  + 1.0))- 0.5; 
	float y = (gl_FragCoord.y/(u_resolution.y  + 1.0))- 0.5;
	// float x = gl_FragCoord.x ;
	// float y = gl_FragCoord.y ;

	vec3 dir = normalize(vec3(x, y, -1.0));
	gl_FragColor = vec4(cast_ray(orig, dir, objects),1.0);
}