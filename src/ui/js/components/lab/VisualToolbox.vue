<template>
	<code v-pre>
		<xml id="toolbox" style="display: none">
			<category name="Logic" colour="210">
				<category name="If" colour="210">
					<block type="controls_if" />
					<block type="controls_if">
						<mutation else="1" />
					</block>
					<block type="controls_if">
						<mutation elseif="1" else="1" />
					</block>
				</category>
				<category name="Boolean" colour="210">
					<block type="logic_compare" />
					<block type="logic_operation" />
					<block type="logic_negate" />
					<block type="logic_boolean" />
					<block type="logic_null" />
					<block type="logic_ternary" />
				</category>
			</category>
			<category name="Loops" colour="120">
				<block type="controls_repeat_ext">
					<value name="TIMES">
						<block type="math_number">
							<field name="NUM">10</field>
						</block>
					</value>
				</block>
				<block type="controls_whileUntil" />
				<block type="controls_for">
					<field name="VAR">i</field>
					<value name="FROM">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="TO">
						<block type="math_number">
							<field name="NUM">10</field>
						</block>
					</value>
					<value name="BY">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
				</block>
				<block type="controls_forEach" />
				<block type="controls_flow_statements" />
			</category>
			<category name="Math" colour="230">
				<block type="math_number">
					<field name="NUM">123</field>
				</block>
				<block type="math_arithmetic" />
				<block type="math_single" />
				<block type="math_trig" />
				<block type="math_constant" />
				<block type="math_number_property" />
				<block type="math_round" />
				<block type="math_on_list" />
				<block type="math_modulo" />
				<block type="math_constrain">
					<value name="LOW">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="HIGH">
						<block type="math_number">
							<field name="NUM">100</field>
						</block>
					</value>
				</block>
				<block type="math_random_int">
					<value name="FROM">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="TO">
						<block type="math_number">
							<field name="NUM">100</field>
						</block>
					</value>
				</block>
				<block type="math_random_float" />
			</category>
			<category name="Lists" colour="260">
				<block type="lists_create_empty" />
				<block type="lists_create_with" />
				<block type="lists_repeat">
					<value name="NUM">
						<block type="math_number">
							<field name="NUM">5</field>
						</block>
					</value>
				</block>
				<block type="lists_length" />
				<block type="lists_isEmpty" />
				<block type="lists_indexOf" />
				<block type="lists_getIndex" />
				<block type="lists_setIndex" />
			</category>
			<sep />
			<category name="Variables" custom="VARIABLE" colour="330" />
			<category name="Functions" custom="PROCEDURE" colour="290" />
			<sep />
			<category name="Pin access" colour="100">

				<block type="analogread"> 
					<value name="pin">
						<block type="pin"/>
					</value>
				</block>

				<block type="digitalread">
					<value name="pin">
						<block type="pin"/>
					</value>
				</block>

				<block type="analogwrite">
					<value name="pin">
						<block type="pin"/>
					</value>
					<value name="value">
						<block type="math_number"/>
					</value>
				</block>

				<block type="digitalwrite" > 
					<value name="pin">
						<block type="pin"/>
					</value>
					<value name="value">
						<block type="logic_boolean"/>
					</value>
				</block>

				<block type="pinmode">
					<value name="NAME">
						<block type="pin"/>
					</value>
				</block>


				<block type="variables_set">
					<field name="VAR">newItem</field>
					<value name="VALUE">
						<block type="led">
							<value name="pin">
								<block type="pin">
									<field name="pin">R4</field>
								</block>
							</value>
						</block>
					</value>
				</block>
				
			
				<block type="led"> 
					<value name="pin">
						<block type="pin"/>
					</value>
				</block>

				<block type="pwm_led"> 
					<value name="led">
						<block type="pin"/>
					</value>
				</block>

				<block type="button">
					<value name="pin_number">
						<block type="pin"/>
					</value>
				</block>

				<block type="button_is_pressed">
					<value name="button">
						<block type="button">
							<value name="pin_number">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block> 

				<block type="led_blink"> 
					<value name="led">
						<block type="led">
							<value name="pin">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="pwm_on"> 
					<value name="pwm_led">
						<block type="pwm_led">
							<value name="led">
								<block type="pin"/>
							</value>
						</block>
					</value>
					<value name="value">
						<block type="math_number"/>
					</value>
				</block>

				<block type="button_wait_for_press">
					<value name="button">
						<block type="button">
							<value name="pin_number">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="pause" /> 

				<block type="trafficlight"> 
					<value name="red">
						<block type="pin"/>
					</value>
					<value name="yellow">
						<block type="pin"/>
					</value>
					<value name="green">
						<block type="pin"/>
					</value>
				</block>

				<block type="turn_on"> 
					<value name="NAME">
						<block type="led">
							<value name="pin">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="turn_off"> 
					<value name="NAME">
						<block type="led">
							<value name="pin">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="traffic_light_on"> 
					<value name="NAME">
						<block type="trafficlight">
							<value name="red">
								<block type="pin"/>
							</value>
							<value name="yellow">
								<block type="pin"/>
							</value>
							<value name="green">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="traffic_light_off">
					<value name="NAME">
						<block type="trafficlight">
							<value name="red">
								<block type="pin"/>
							</value>
							<value name="yellow">
								<block type="pin"/>
							</value>
							<value name="green">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>

				<block type="pwm_pulse">
					<value name="pwm_led">
						<block type="pwm_led">
							<value name="led">
								<block type="pin"/>
							</value>
						</block>
					</value>
				</block>
				<!-- <block type="start_labnetwork" /> -->



			</category>

		</xml>
	</code>
</template>

<script>
module.exports = {
	name: 'VisualToolbox'
};
</script>

