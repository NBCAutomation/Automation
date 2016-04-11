{% extends "base.php" %}

{% block content %}
	<div class="row">
		<h2 class="lead">{{title}}</h2>
	</div>
	<div class="row">
		<div class="api_results">
				<ul>
				{% for key, values in results %}
				    <li>{{ loop.index }}: {{ key }}
				    	<ul>
						{% for __key, value in values %}
							<li>
								{{ loop.parent.loop.index }}.{{ loop.index }}: {{ value }} {{__key}}
								{% if loop.index == 1 %}
									{% set subArray = value %}
									<ul>
									{% for __subKey, __subValues in subArray %}
										<li>{{ loop.index }}: {{ __subKey }} > {{ __subValues }}</li>
										{% for __value in __subValues %}
											-- {{ loop.parent.loop.index }}.{{ loop.index }}: {{ __value }}
										{% endfor %}
									{% endfor %}
									</ul>
								{% endif %}
							</li>
						{% endfor %}
					</ul>
					</li>
				{% endfor %}
			</ul>
		</div>		
	</div>

{% endblock %}