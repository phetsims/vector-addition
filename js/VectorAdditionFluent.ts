// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from vector-addition-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import type {FluentVariable} from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import vectorAddition from './vectorAddition.js';
import VectorAdditionStrings from './VectorAdditionStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( VectorAdditionStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'vector_addition_title', 'vector-addition.titleStringProperty' );
addToMapIfDefined( 'screen_equations', 'screen.equationsStringProperty' );
addToMapIfDefined( 'screen_explore1D', 'screen.explore1DStringProperty' );
addToMapIfDefined( 'screen_explore2D', 'screen.explore2DStringProperty' );
addToMapIfDefined( 'screen_lab', 'screen.labStringProperty' );
addToMapIfDefined( 'sum', 'sumStringProperty' );
addToMapIfDefined( 'values', 'valuesStringProperty' );
addToMapIfDefined( 'components', 'componentsStringProperty' );
addToMapIfDefined( 'noVectorSelected', 'noVectorSelectedStringProperty' );
addToMapIfDefined( 'vectorValues', 'vectorValuesStringProperty' );
addToMapIfDefined( 'symbol_x', 'symbol.xStringProperty' );
addToMapIfDefined( 'symbol_y', 'symbol.yStringProperty' );
addToMapIfDefined( 'baseVectors', 'baseVectorsStringProperty' );
addToMapIfDefined( 'equation', 'equationStringProperty' );
addToMapIfDefined( 'angleConvention', 'angleConventionStringProperty' );
addToMapIfDefined( 'angleConventionDescription', 'angleConventionDescriptionStringProperty' );
addToMapIfDefined( 'signedRange', 'signedRangeStringProperty' );
addToMapIfDefined( 'unsignedRange', 'unsignedRangeStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_graphAreaOrigin', 'keyboardHelpDialog.graphAreaOriginStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_vectors', 'keyboardHelpDialog.vectorsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_removeFromGraphArea', 'keyboardHelpDialog.removeFromGraphAreaStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_selectOrDeselect', 'keyboardHelpDialog.selectOrDeselectStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveVector', 'keyboardHelpDialog.moveVectorStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_scaleRotateVector', 'keyboardHelpDialog.scaleRotateVectorStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_checkVectorValues', 'keyboardHelpDialog.checkVectorValuesStringProperty' );
addToMapIfDefined( 'a11y_explore1DScreen_screenButtonsHelpText', 'a11y.explore1DScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_explore1DScreen_screenSummary_playArea', 'a11y.explore1DScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_explore1DScreen_screenSummary_controlArea', 'a11y.explore1DScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_explore1DScreen_screenSummary_currentDetails', 'a11y.explore1DScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_explore1DScreen_screenSummary_interactionHint', 'a11y.explore1DScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenButtonsHelpText', 'a11y.explore2DScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_playArea', 'a11y.explore2DScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_controlArea', 'a11y.explore2DScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_currentDetails', 'a11y.explore2DScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_interactionHint', 'a11y.explore2DScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenButtonsHelpText', 'a11y.labScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_playArea', 'a11y.labScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_controlArea', 'a11y.labScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_currentDetails', 'a11y.labScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_interactionHint', 'a11y.labScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenButtonsHelpText', 'a11y.equationsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_playArea', 'a11y.equationsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_controlArea', 'a11y.equationsScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_currentDetails', 'a11y.equationsScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_interactionHint', 'a11y.equationsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_accessibleHeadings_availableVectors', 'a11y.accessibleHeadings.availableVectorsStringProperty' );
addToMapIfDefined( 'a11y_accessibleHeadings_graphAreaHeading', 'a11y.accessibleHeadings.graphAreaHeadingStringProperty' );
addToMapIfDefined( 'a11y_graphArea_accessibleParagraphExplore', 'a11y.graphArea.accessibleParagraphExploreStringProperty' );
addToMapIfDefined( 'a11y_graphArea_accessibleParagraphLab', 'a11y.graphArea.accessibleParagraphLabStringProperty' );
addToMapIfDefined( 'a11y_graphArea_accessibleParagraphEquations', 'a11y.graphArea.accessibleParagraphEquationsStringProperty' );
addToMapIfDefined( 'a11y_horizontalSceneName', 'a11y.horizontalSceneNameStringProperty' );
addToMapIfDefined( 'a11y_verticalSceneName', 'a11y.verticalSceneNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianSceneName', 'a11y.cartesianSceneNameStringProperty' );
addToMapIfDefined( 'a11y_polarSceneName', 'a11y.polarSceneNameStringProperty' );
addToMapIfDefined( 'a11y_anglesCheckbox_accessibleName', 'a11y.anglesCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_anglesCheckbox_accessibleHelpText', 'a11y.anglesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_gridCheckbox_accessibleName', 'a11y.gridCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_gridCheckbox_accessibleHelpText', 'a11y.gridCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_sumCheckbox_accessibleName', 'a11y.sumCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_sumCheckbox_accessibleHelpText', 'a11y.sumCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_sumCheckbox_accessibleContextResponseChecked', 'a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_sumCheckbox_accessibleContextResponseUnchecked', 'a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_labSumCheckbox_accessibleName', 'a11y.labSumCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_equationsSumCheckbox_accessibleName', 'a11y.equationsSumCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_valuesCheckbox_accessibleHelpText', 'a11y.valuesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_componentsRadioButtonGroup_accessibleName', 'a11y.componentsRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_componentsRadioButtonGroup_accessibleHelpText', 'a11y.componentsRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_invisibleRadioButton_accessibleName', 'a11y.invisibleRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_triangleRadioButton_accessibleName', 'a11y.triangleRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_parallelogramRadioButton_accessibleName', 'a11y.parallelogramRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_projectionRadioButton_accessibleName', 'a11y.projectionRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianPolarSceneRadioButtonGroup_accessibleName', 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianPolarSceneRadioButtonGroup_accessibleHelpText', 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_cartesianRadioButton_accessibleName', 'a11y.cartesianRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_polarRadioButton_accessibleName', 'a11y.polarRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleName', 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleHelpText', 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_horizontalRadioButton_accessibleName', 'a11y.horizontalRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_verticalRadioButton_accessibleName', 'a11y.verticalRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_equationTypeRadioButtonGroup_accessibleName', 'a11y.equationTypeRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_equationTypeRadioButtonGroup_accessibleHelpText', 'a11y.equationTypeRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_additionRadioButton_accessibleName', 'a11y.additionRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_subtractionRadioButton_accessibleName', 'a11y.subtractionRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_negationRadioButton_accessibleName', 'a11y.negationRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorsCheckbox_accessibleName', 'a11y.baseVectorsCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorsCheckbox_accessibleHelpText', 'a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_originManipulator_accessibleName', 'a11y.originManipulator.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_originManipulator_accessibleHelpText', 'a11y.originManipulator.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_originManipulator_accessibleObjectResponse', 'a11y.originManipulator.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleHelpText', 'a11y.eraserButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleContextResponse', 'a11y.eraserButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_vectorValuesAccordionBox_accessibleParagraph', 'a11y.vectorValuesAccordionBox.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_vectorValuesAccordionBox_accessibleHelpTextCollapsed', 'a11y.vectorValuesAccordionBox.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_vectorValuesAccordionBox_accessibleParagraphBaseVector', 'a11y.vectorValuesAccordionBox.accessibleParagraphBaseVectorStringProperty' );
addToMapIfDefined( 'a11y_vectorValuesAccordionBox_accessibleParagraphCoefficientVector', 'a11y.vectorValuesAccordionBox.accessibleParagraphCoefficientVectorStringProperty' );
addToMapIfDefined( 'a11y_equationAccordionBox_accessibleHelpTextCollapsed', 'a11y.equationAccordionBox.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_symbolSubSubscript', 'a11y.symbolSubSubscriptStringProperty' );
addToMapIfDefined( 'a11y_signedRadioButton', 'a11y.signedRadioButtonStringProperty' );
addToMapIfDefined( 'a11y_unsignedRadioButton', 'a11y.unsignedRadioButtonStringProperty' );
addToMapIfDefined( 'a11y_baseVectorXComponentPicker_accessibleName', 'a11y.baseVectorXComponentPicker.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorXComponentPicker_accessibleHelpText', 'a11y.baseVectorXComponentPicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_baseVectorYComponentPicker_accessibleName', 'a11y.baseVectorYComponentPicker.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorYComponentPicker_accessibleHelpText', 'a11y.baseVectorYComponentPicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_baseVectorMagnitudePicker_accessibleName', 'a11y.baseVectorMagnitudePicker.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorMagnitudePicker_accessibleHelpText', 'a11y.baseVectorMagnitudePicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_baseVectorAnglePicker_accessibleName', 'a11y.baseVectorAnglePicker.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorAnglePicker_accessibleHelpText', 'a11y.baseVectorAnglePicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_coefficientPicker_accessibleName', 'a11y.coefficientPicker.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_coefficientPicker_accessibleHelpText', 'a11y.coefficientPicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorButton_accessibleName', 'a11y.vectorButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_vectorButton_accessibleHelpText', 'a11y.vectorButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorSetButton_accessibleName', 'a11y.vectorSetButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_vectorSetButton_accessibleHelpText', 'a11y.vectorSetButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorSetButton_accessibleHelpTextEmpty', 'a11y.vectorSetButton.accessibleHelpTextEmptyStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_body_accessibleName', 'a11y.vectorNode.body.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_body_accessibleHelpText', 'a11y.vectorNode.body.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_body_accessibleObjectResponse', 'a11y.vectorNode.body.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_body_accessibleObjectResponseTipOutsideGraphArea', 'a11y.vectorNode.body.accessibleObjectResponseTipOutsideGraphAreaStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_tip_accessibleName', 'a11y.vectorNode.tip.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_tip_accessibleHelpText', 'a11y.vectorNode.tip.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_tip_accessibleObjectResponse', 'a11y.vectorNode.tip.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_equationsVectorNode_accessibleName', 'a11y.equationsVectorNode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorNode_accessibleName', 'a11y.baseVectorNode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_vectorAddedToGraphArea', 'a11y.vectorAddedToGraphAreaStringProperty' );
addToMapIfDefined( 'a11y_vectorRemovedFromGraphArea', 'a11y.vectorRemovedFromGraphAreaStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const VectorAdditionFluent = {
  "vector-addition": {
    titleStringProperty: _.get( VectorAdditionStrings, 'vector-addition.titleStringProperty' )
  },
  screen: {
    equationsStringProperty: _.get( VectorAdditionStrings, 'screen.equationsStringProperty' ),
    explore1DStringProperty: _.get( VectorAdditionStrings, 'screen.explore1DStringProperty' ),
    explore2DStringProperty: _.get( VectorAdditionStrings, 'screen.explore2DStringProperty' ),
    labStringProperty: _.get( VectorAdditionStrings, 'screen.labStringProperty' )
  },
  sumStringProperty: _.get( VectorAdditionStrings, 'sumStringProperty' ),
  valuesStringProperty: _.get( VectorAdditionStrings, 'valuesStringProperty' ),
  componentsStringProperty: _.get( VectorAdditionStrings, 'componentsStringProperty' ),
  noVectorSelectedStringProperty: _.get( VectorAdditionStrings, 'noVectorSelectedStringProperty' ),
  vectorValuesStringProperty: _.get( VectorAdditionStrings, 'vectorValuesStringProperty' ),
  symbol: {
    xStringProperty: _.get( VectorAdditionStrings, 'symbol.xStringProperty' ),
    yStringProperty: _.get( VectorAdditionStrings, 'symbol.yStringProperty' )
  },
  baseVectorsStringProperty: _.get( VectorAdditionStrings, 'baseVectorsStringProperty' ),
  equationStringProperty: _.get( VectorAdditionStrings, 'equationStringProperty' ),
  angleConventionStringProperty: _.get( VectorAdditionStrings, 'angleConventionStringProperty' ),
  angleConventionDescriptionStringProperty: _.get( VectorAdditionStrings, 'angleConventionDescriptionStringProperty' ),
  signedRangeStringProperty: _.get( VectorAdditionStrings, 'signedRangeStringProperty' ),
  unsignedRangeStringProperty: _.get( VectorAdditionStrings, 'unsignedRangeStringProperty' ),
  keyboardHelpDialog: {
    graphAreaOriginStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.graphAreaOriginStringProperty' ),
    vectorsStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.vectorsStringProperty' ),
    removeFromGraphAreaStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.removeFromGraphAreaStringProperty' ),
    selectOrDeselectStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.selectOrDeselectStringProperty' ),
    moveVectorStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.moveVectorStringProperty' ),
    scaleRotateVectorStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.scaleRotateVectorStringProperty' ),
    checkVectorValuesStringProperty: _.get( VectorAdditionStrings, 'keyboardHelpDialog.checkVectorValuesStringProperty' )
  },
  a11y: {
    explore1DScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ numberOfVectors: FluentVariable, sceneName: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenSummary_currentDetails', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.currentDetailsStringProperty' ), [{"name":"numberOfVectors"},{"name":"sceneName"}] ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    explore2DScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ numberOfVectors: FluentVariable, sceneName: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_currentDetails', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.currentDetailsStringProperty' ), [{"name":"numberOfVectors"},{"name":"sceneName"}] ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    labScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.labScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ sceneName: FluentVariable, vectorSet1Size: FluentVariable, vectorSet1Symbol: FluentVariable, vectorSet2Size: FluentVariable, vectorSet2Symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_currentDetails', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.currentDetailsStringProperty' ), [{"name":"sceneName"},{"name":"vectorSet1Size"},{"name":"vectorSet1Symbol"},{"name":"vectorSet2Size"},{"name":"vectorSet2Symbol"}] ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    equationsScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.playAreaStringProperty' ) ),
        controlArea: new FluentPattern<{ symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.controlAreaStringProperty' ), [{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] ),
        currentDetails: new FluentPattern<{ coefficient1: FluentVariable, coefficient2: FluentVariable, equationType: 'addition' | 'subtraction' | 'negation' | TReadOnlyProperty<'addition' | 'subtraction' | 'negation'>, symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_currentDetails', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.currentDetailsStringProperty' ), [{"name":"coefficient1"},{"name":"coefficient2"},{"name":"equationType","variants":["addition","subtraction","negation"]},{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    accessibleHeadings: {
      availableVectorsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_accessibleHeadings_availableVectors', _.get( VectorAdditionStrings, 'a11y.accessibleHeadings.availableVectorsStringProperty' ) ),
      graphAreaHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_accessibleHeadings_graphAreaHeading', _.get( VectorAdditionStrings, 'a11y.accessibleHeadings.graphAreaHeadingStringProperty' ) )
    },
    graphArea: {
      accessibleParagraphExplore: new FluentPattern<{ numberOfVectors: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_graphArea_accessibleParagraphExplore', _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphExploreStringProperty' ), [{"name":"numberOfVectors"}] ),
      accessibleParagraphLab: new FluentPattern<{ vectorSet1Size: FluentVariable, vectorSet1Symbol: FluentVariable, vectorSet2Size: FluentVariable, vectorSet2Symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_graphArea_accessibleParagraphLab', _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphLabStringProperty' ), [{"name":"vectorSet1Size"},{"name":"vectorSet1Symbol"},{"name":"vectorSet2Size"},{"name":"vectorSet2Symbol"}] ),
      accessibleParagraphEquations: new FluentPattern<{ numberOfVectors: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_graphArea_accessibleParagraphEquations', _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphEquationsStringProperty' ), [{"name":"numberOfVectors"}] )
    },
    horizontalSceneNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalSceneName', _.get( VectorAdditionStrings, 'a11y.horizontalSceneNameStringProperty' ) ),
    verticalSceneNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_verticalSceneName', _.get( VectorAdditionStrings, 'a11y.verticalSceneNameStringProperty' ) ),
    cartesianSceneNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cartesianSceneName', _.get( VectorAdditionStrings, 'a11y.cartesianSceneNameStringProperty' ) ),
    polarSceneNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_polarSceneName', _.get( VectorAdditionStrings, 'a11y.polarSceneNameStringProperty' ) ),
    anglesCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_anglesCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.anglesCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_anglesCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.anglesCheckbox.accessibleHelpTextStringProperty' ) )
    },
    gridCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gridCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.gridCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gridCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.gridCheckbox.accessibleHelpTextStringProperty' ) )
    },
    sumCheckbox: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_sumCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_sumCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] ),
      accessibleContextResponseChecked: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_sumCheckbox_accessibleContextResponseChecked', _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty' ), [{"name":"symbol"}] ),
      accessibleContextResponseUnchecked: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_sumCheckbox_accessibleContextResponseUnchecked', _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty' ), [{"name":"symbol"}] )
    },
    labSumCheckbox: {
      accessibleName: new FluentPattern<{ sumSymbol: FluentVariable, vectorSetSymbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_labSumCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.labSumCheckbox.accessibleNameStringProperty' ), [{"name":"sumSymbol"},{"name":"vectorSetSymbol"}] )
    },
    equationsSumCheckbox: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_equationsSumCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.equationsSumCheckbox.accessibleNameStringProperty' ), [{"name":"symbol"}] )
    },
    valuesCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valuesCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.valuesCheckbox.accessibleHelpTextStringProperty' ) )
    },
    componentsRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_componentsRadioButtonGroup_accessibleName', _.get( VectorAdditionStrings, 'a11y.componentsRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_componentsRadioButtonGroup_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.componentsRadioButtonGroup.accessibleHelpTextStringProperty' ) )
    },
    invisibleRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_invisibleRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.invisibleRadioButton.accessibleNameStringProperty' ) )
    },
    triangleRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_triangleRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.triangleRadioButton.accessibleNameStringProperty' ) )
    },
    parallelogramRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_parallelogramRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.parallelogramRadioButton.accessibleNameStringProperty' ) )
    },
    projectionRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_projectionRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.projectionRadioButton.accessibleNameStringProperty' ) )
    },
    cartesianPolarSceneRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cartesianPolarSceneRadioButtonGroup_accessibleName', _.get( VectorAdditionStrings, 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpText: new FluentPattern<{ polarAngleInterval: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_cartesianPolarSceneRadioButtonGroup_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleHelpTextStringProperty' ), [{"name":"polarAngleInterval"}] )
    },
    cartesianRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cartesianRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.cartesianRadioButton.accessibleNameStringProperty' ) )
    },
    polarRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_polarRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.polarRadioButton.accessibleNameStringProperty' ) )
    },
    horizontalVerticalSceneRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleName', _.get( VectorAdditionStrings, 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleHelpTextStringProperty' ) )
    },
    horizontalRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.horizontalRadioButton.accessibleNameStringProperty' ) )
    },
    verticalRadioButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_verticalRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.verticalRadioButton.accessibleNameStringProperty' ) )
    },
    equationTypeRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationTypeRadioButtonGroup_accessibleName', _.get( VectorAdditionStrings, 'a11y.equationTypeRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpText: new FluentPattern<{ symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_equationTypeRadioButtonGroup_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.equationTypeRadioButtonGroup.accessibleHelpTextStringProperty' ), [{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] )
    },
    additionRadioButton: {
      accessibleName: new FluentPattern<{ symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_additionRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.additionRadioButton.accessibleNameStringProperty' ), [{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] )
    },
    subtractionRadioButton: {
      accessibleName: new FluentPattern<{ symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_subtractionRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.subtractionRadioButton.accessibleNameStringProperty' ), [{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] )
    },
    negationRadioButton: {
      accessibleName: new FluentPattern<{ symbol1: FluentVariable, symbol2: FluentVariable, symbol3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_negationRadioButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.negationRadioButton.accessibleNameStringProperty' ), [{"name":"symbol1"},{"name":"symbol2"},{"name":"symbol3"}] )
    },
    baseVectorsCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_baseVectorsCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorsCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_baseVectorsCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty' ) )
    },
    originManipulator: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_originManipulator_accessibleName', _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_originManipulator_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleHelpTextStringProperty' ) ),
      accessibleObjectResponse: new FluentPattern<{ maxX: FluentVariable, maxY: FluentVariable, minX: FluentVariable, minY: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_originManipulator_accessibleObjectResponse', _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleObjectResponseStringProperty' ), [{"name":"maxX"},{"name":"maxY"},{"name":"minX"},{"name":"minY"}] )
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleContextResponse', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleContextResponseStringProperty' ) )
    },
    vectorValuesAccordionBox: {
      accessibleParagraph: new FluentPattern<{ direction: FluentVariable, magnitude: FluentVariable, symbol: FluentVariable, xComponent: FluentVariable, yComponent: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorValuesAccordionBox_accessibleParagraph', _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphStringProperty' ), [{"name":"direction"},{"name":"magnitude"},{"name":"symbol"},{"name":"xComponent"},{"name":"yComponent"}] ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorValuesAccordionBox_accessibleHelpTextCollapsed', _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleHelpTextCollapsedStringProperty' ) ),
      accessibleParagraphBaseVector: new FluentPattern<{ direction: FluentVariable, magnitude: FluentVariable, symbol: FluentVariable, xComponent: FluentVariable, yComponent: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorValuesAccordionBox_accessibleParagraphBaseVector', _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphBaseVectorStringProperty' ), [{"name":"direction"},{"name":"magnitude"},{"name":"symbol"},{"name":"xComponent"},{"name":"yComponent"}] ),
      accessibleParagraphCoefficientVector: new FluentPattern<{ coefficient: FluentVariable, direction: FluentVariable, magnitude: FluentVariable, symbol: FluentVariable, xComponent: FluentVariable, yComponent: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorValuesAccordionBox_accessibleParagraphCoefficientVector', _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphCoefficientVectorStringProperty' ), [{"name":"coefficient"},{"name":"direction"},{"name":"magnitude"},{"name":"symbol"},{"name":"xComponent"},{"name":"yComponent"}] )
    },
    equationAccordionBox: {
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationAccordionBox_accessibleHelpTextCollapsed', _.get( VectorAdditionStrings, 'a11y.equationAccordionBox.accessibleHelpTextCollapsedStringProperty' ) )
    },
    symbolSubSubscript: new FluentPattern<{ subscript: FluentVariable, symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_symbolSubSubscript', _.get( VectorAdditionStrings, 'a11y.symbolSubSubscriptStringProperty' ), [{"name":"subscript"},{"name":"symbol"}] ),
    signedRadioButtonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_signedRadioButton', _.get( VectorAdditionStrings, 'a11y.signedRadioButtonStringProperty' ) ),
    unsignedRadioButtonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_unsignedRadioButton', _.get( VectorAdditionStrings, 'a11y.unsignedRadioButtonStringProperty' ) ),
    baseVectorXComponentPicker: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorXComponentPicker_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorXComponentPicker.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorXComponentPicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorXComponentPicker.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] )
    },
    baseVectorYComponentPicker: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorYComponentPicker_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorYComponentPicker.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorYComponentPicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorYComponentPicker.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] )
    },
    baseVectorMagnitudePicker: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorMagnitudePicker_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorMagnitudePicker.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorMagnitudePicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorMagnitudePicker.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] )
    },
    baseVectorAnglePicker: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorAnglePicker_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorAnglePicker.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorAnglePicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorAnglePicker.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] )
    },
    coefficientPicker: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_coefficientPicker_accessibleName', _.get( VectorAdditionStrings, 'a11y.coefficientPicker.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_coefficientPicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.coefficientPicker.accessibleHelpTextStringProperty' ) )
    },
    vectorButton: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.vectorButton.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorButton_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorButton.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] )
    },
    vectorSetButton: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorSetButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpText: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorSetButton_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleHelpTextStringProperty' ), [{"name":"symbol"}] ),
      accessibleHelpTextEmptyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorSetButton_accessibleHelpTextEmpty', _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleHelpTextEmptyStringProperty' ) )
    },
    vectorNode: {
      body: {
        accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorNode_body_accessibleName', _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorNode_body_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponse: new FluentPattern<{ tailX: FluentVariable, tailY: FluentVariable, tipX: FluentVariable, tipY: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorNode_body_accessibleObjectResponse', _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleObjectResponseStringProperty' ), [{"name":"tailX"},{"name":"tailY"},{"name":"tipX"},{"name":"tipY"}] ),
        accessibleObjectResponseTipOutsideGraphArea: new FluentPattern<{ tailX: FluentVariable, tailY: FluentVariable, tipX: FluentVariable, tipY: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorNode_body_accessibleObjectResponseTipOutsideGraphArea', _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleObjectResponseTipOutsideGraphAreaStringProperty' ), [{"name":"tailX"},{"name":"tailY"},{"name":"tipX"},{"name":"tipY"}] )
      },
      tip: {
        accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorNode_tip_accessibleName', _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleNameStringProperty' ), [{"name":"symbol"}] ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorNode_tip_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponse: new FluentPattern<{ angle: FluentVariable, coordinateSnapMode: 'cartesian' | 'polar' | TReadOnlyProperty<'cartesian' | 'polar'>, magnitude: FluentVariable, tipReturnedToGraphArea: 'true' | 'false' | TReadOnlyProperty<'true' | 'false'>, tipX: FluentVariable, tipY: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorNode_tip_accessibleObjectResponse', _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleObjectResponseStringProperty' ), [{"name":"angle"},{"name":"coordinateSnapMode","variants":["cartesian","polar"]},{"name":"magnitude"},{"name":"tipReturnedToGraphArea","variants":["true","false"]},{"name":"tipX"},{"name":"tipY"}] )
      }
    },
    equationsVectorNode: {
      accessibleName: new FluentPattern<{ coefficient: FluentVariable, symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_equationsVectorNode_accessibleName', _.get( VectorAdditionStrings, 'a11y.equationsVectorNode.accessibleNameStringProperty' ), [{"name":"coefficient"},{"name":"symbol"}] )
    },
    baseVectorNode: {
      accessibleName: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_baseVectorNode_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorNode.accessibleNameStringProperty' ), [{"name":"symbol"}] )
    },
    vectorAddedToGraphArea: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorAddedToGraphArea', _.get( VectorAdditionStrings, 'a11y.vectorAddedToGraphAreaStringProperty' ), [{"name":"symbol"}] ),
    vectorRemovedFromGraphArea: new FluentPattern<{ symbol: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_vectorRemovedFromGraphArea', _.get( VectorAdditionStrings, 'a11y.vectorRemovedFromGraphAreaStringProperty' ), [{"name":"symbol"}] )
  }
};

export default VectorAdditionFluent;

vectorAddition.register('VectorAdditionFluent', VectorAdditionFluent);
