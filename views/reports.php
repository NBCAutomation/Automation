{% extends "base.php" %}

{% block content %}
	<div class="row">
		<h2 class="lead">{{title}}</h2>
	</div>
	<div class="row">
		<div class="api_results">
				<ul>
				{% for key, values in results %}
				    <li>{{ key }}
				    	<ul>
						{% for __key, value in values %}
							<li>
								{{__key}}
								{% if loop.index == 1 %}
									{% set subArray = value %}
									<ul>
									{% for __subKey, __subValues in subArray %}
										<li>
											<a href="/test_results/{{ key }}/{{__key}}/{{ __subValues }}">
												{{ __subValues }}
											</a>
										</li>
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