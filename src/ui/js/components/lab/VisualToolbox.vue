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
		</xml>
	</code>
</template>

<script>
module.exports = {
	name: 'VisualToolbox'
};
</script>

