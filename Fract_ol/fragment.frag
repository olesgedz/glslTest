#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float ca = 0.0;
float cb = 0.0;

float map(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


int julia(float x, float y)
{
	float		za;
	float		zb;
	float		temp;
	int			i;

	za = map(x, 0.0, u_resolution.x, -1.0, 1.0);
	zb = map(y, 0.0, u_resolution.y, -1.0, 1.0);
	i = 0;
	float x1 = 0.0;
	float y1 = 0.0;

	while ((za * za + zb * zb <= 4.0) && (i < 400))
	{
		temp = za;
		za = za * za - zb * zb + ca;
		zb = 2.0 * temp * zb + cb;
		i++;
	}
	return (i);
}


void main()
{
	float fov = 90.0;
	ca = u_mouse.x / u_resolution.x * 2.0;
	cb = u_mouse.y / u_resolution.y * 2.0;

	int ret = julia(gl_FragCoord.x, gl_FragCoord.y);

	if (ret >= 400)
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	else if(ret >= 100)
	{
		gl_FragColor = vec4(0.9725, 0.6745, 0.0353, 1.0);

	}
	else
	{
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
}