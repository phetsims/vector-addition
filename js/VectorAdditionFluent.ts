// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from vector-addition-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
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
addToMapIfDefined( 'a11y_explore1DScreen_screenSummary_interactionHint', 'a11y.explore1DScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenButtonsHelpText', 'a11y.explore2DScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_playArea', 'a11y.explore2DScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_controlArea', 'a11y.explore2DScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_explore2DScreen_screenSummary_interactionHint', 'a11y.explore2DScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenButtonsHelpText', 'a11y.labScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_playArea', 'a11y.labScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_controlArea', 'a11y.labScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_labScreen_screenSummary_interactionHint', 'a11y.labScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenButtonsHelpText', 'a11y.equationsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_playArea', 'a11y.equationsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_equationsScreen_screenSummary_interactionHint', 'a11y.equationsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_accessibleHeadings_availableVectors', 'a11y.accessibleHeadings.availableVectorsStringProperty' );
addToMapIfDefined( 'a11y_accessibleHeadings_graphAreaHeading', 'a11y.accessibleHeadings.graphAreaHeadingStringProperty' );
addToMapIfDefined( 'a11y_horizontalSceneName', 'a11y.horizontalSceneNameStringProperty' );
addToMapIfDefined( 'a11y_verticalSceneName', 'a11y.verticalSceneNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianSceneName', 'a11y.cartesianSceneNameStringProperty' );
addToMapIfDefined( 'a11y_polarSceneName', 'a11y.polarSceneNameStringProperty' );
addToMapIfDefined( 'a11y_anglesCheckbox_accessibleName', 'a11y.anglesCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_anglesCheckbox_accessibleHelpText', 'a11y.anglesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_gridCheckbox_accessibleName', 'a11y.gridCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_gridCheckbox_accessibleHelpText', 'a11y.gridCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_valuesCheckbox_accessibleHelpText', 'a11y.valuesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_componentsRadioButtonGroup_accessibleName', 'a11y.componentsRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_componentsRadioButtonGroup_accessibleHelpText', 'a11y.componentsRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_invisibleRadioButton_accessibleName', 'a11y.invisibleRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_triangleRadioButton_accessibleName', 'a11y.triangleRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_parallelogramRadioButton_accessibleName', 'a11y.parallelogramRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_projectionRadioButton_accessibleName', 'a11y.projectionRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianPolarSceneRadioButtonGroup_accessibleName', 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_cartesianRadioButton_accessibleName', 'a11y.cartesianRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_polarRadioButton_accessibleName', 'a11y.polarRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleName', 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_horizontalVerticalSceneRadioButtonGroup_accessibleHelpText', 'a11y.horizontalVerticalSceneRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_horizontalRadioButton_accessibleName', 'a11y.horizontalRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_verticalRadioButton_accessibleName', 'a11y.verticalRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_equationTypeRadioButtonGroup_accessibleName', 'a11y.equationTypeRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorsCheckbox_accessibleName', 'a11y.baseVectorsCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_baseVectorsCheckbox_accessibleHelpText', 'a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_originManipulator_accessibleName', 'a11y.originManipulator.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_originManipulator_accessibleHelpText', 'a11y.originManipulator.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleHelpText', 'a11y.eraserButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleContextResponse', 'a11y.eraserButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_vectorValuesAccordionBox_accessibleHelpTextCollapsed', 'a11y.vectorValuesAccordionBox.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_equationAccordionBox_accessibleHelpTextCollapsed', 'a11y.equationAccordionBox.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_signedRadioButton', 'a11y.signedRadioButtonStringProperty' );
addToMapIfDefined( 'a11y_unsignedRadioButton', 'a11y.unsignedRadioButtonStringProperty' );
addToMapIfDefined( 'a11y_coefficientPicker_accessibleHelpText', 'a11y.coefficientPicker.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorSetButton_accessibleHelpTextEmpty', 'a11y.vectorSetButton.accessibleHelpTextEmptyStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_body_accessibleHelpText', 'a11y.vectorNode.body.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_vectorNode_tip_accessibleHelpText', 'a11y.vectorNode.tip.accessibleHelpTextStringProperty' );

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
        currentDetailsStringProperty: _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.currentDetailsStringProperty' ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore1DScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.explore1DScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    explore2DScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.currentDetailsStringProperty' ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_explore2DScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.explore2DScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    labScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.labScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_controlArea', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.currentDetailsStringProperty' ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_labScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.labScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    equationsScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenButtonsHelpText', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_playArea', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.controlAreaStringProperty' ),
        currentDetailsAdditionStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.currentDetailsAdditionStringProperty' ),
        currentDetailsSubtractionStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.currentDetailsSubtractionStringProperty' ),
        currentDetailsNegationStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.currentDetailsNegationStringProperty' ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationsScreen_screenSummary_interactionHint', _.get( VectorAdditionStrings, 'a11y.equationsScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    accessibleHeadings: {
      availableVectorsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_accessibleHeadings_availableVectors', _.get( VectorAdditionStrings, 'a11y.accessibleHeadings.availableVectorsStringProperty' ) ),
      graphAreaHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_accessibleHeadings_graphAreaHeading', _.get( VectorAdditionStrings, 'a11y.accessibleHeadings.graphAreaHeadingStringProperty' ) )
    },
    graphArea: {
      accessibleParagraphExploreStringProperty: _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphExploreStringProperty' ),
      accessibleParagraphLabStringProperty: _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphLabStringProperty' ),
      accessibleParagraphEquationsStringProperty: _.get( VectorAdditionStrings, 'a11y.graphArea.accessibleParagraphEquationsStringProperty' )
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
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleHelpTextStringProperty' ),
      accessibleContextResponseCheckedStringProperty: _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty' ),
      accessibleContextResponseUncheckedStringProperty: _.get( VectorAdditionStrings, 'a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty' )
    },
    labSumCheckbox: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.labSumCheckbox.accessibleNameStringProperty' )
    },
    equationsSumCheckbox: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsSumCheckbox.accessibleNameStringProperty' )
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
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.cartesianPolarSceneRadioButtonGroup.accessibleHelpTextStringProperty' )
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
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.equationTypeRadioButtonGroup.accessibleHelpTextStringProperty' )
    },
    additionRadioButton: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.additionRadioButton.accessibleNameStringProperty' )
    },
    subtractionRadioButton: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.subtractionRadioButton.accessibleNameStringProperty' )
    },
    negationRadioButton: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.negationRadioButton.accessibleNameStringProperty' )
    },
    baseVectorsCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_baseVectorsCheckbox_accessibleName', _.get( VectorAdditionStrings, 'a11y.baseVectorsCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_baseVectorsCheckbox_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.baseVectorsCheckbox.accessibleHelpTextStringProperty' ) )
    },
    originManipulator: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_originManipulator_accessibleName', _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_originManipulator_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleHelpTextStringProperty' ) ),
      accessibleObjectResponseStringProperty: _.get( VectorAdditionStrings, 'a11y.originManipulator.accessibleObjectResponseStringProperty' )
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleContextResponse', _.get( VectorAdditionStrings, 'a11y.eraserButton.accessibleContextResponseStringProperty' ) )
    },
    vectorValuesAccordionBox: {
      accessibleParagraphStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphStringProperty' ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorValuesAccordionBox_accessibleHelpTextCollapsed', _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleHelpTextCollapsedStringProperty' ) ),
      accessibleParagraphBaseVectorStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphBaseVectorStringProperty' ),
      accessibleParagraphCoefficientVectorStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorValuesAccordionBox.accessibleParagraphCoefficientVectorStringProperty' )
    },
    equationAccordionBox: {
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_equationAccordionBox_accessibleHelpTextCollapsed', _.get( VectorAdditionStrings, 'a11y.equationAccordionBox.accessibleHelpTextCollapsedStringProperty' ) )
    },
    symbolSubSubscriptStringProperty: _.get( VectorAdditionStrings, 'a11y.symbolSubSubscriptStringProperty' ),
    signedRadioButtonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_signedRadioButton', _.get( VectorAdditionStrings, 'a11y.signedRadioButtonStringProperty' ) ),
    unsignedRadioButtonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_unsignedRadioButton', _.get( VectorAdditionStrings, 'a11y.unsignedRadioButtonStringProperty' ) ),
    baseVectorXComponentPicker: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorXComponentPicker.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorXComponentPicker.accessibleHelpTextStringProperty' )
    },
    baseVectorYComponentPicker: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorYComponentPicker.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorYComponentPicker.accessibleHelpTextStringProperty' )
    },
    baseVectorMagnitudePicker: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorMagnitudePicker.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorMagnitudePicker.accessibleHelpTextStringProperty' )
    },
    baseVectorAnglePicker: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorAnglePicker.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorAnglePicker.accessibleHelpTextStringProperty' )
    },
    coefficientPicker: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.coefficientPicker.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_coefficientPicker_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.coefficientPicker.accessibleHelpTextStringProperty' ) )
    },
    vectorButton: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorButton.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorButton.accessibleHelpTextStringProperty' )
    },
    vectorSetButton: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleNameStringProperty' ),
      accessibleHelpTextStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleHelpTextStringProperty' ),
      accessibleHelpTextEmptyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorSetButton_accessibleHelpTextEmpty', _.get( VectorAdditionStrings, 'a11y.vectorSetButton.accessibleHelpTextEmptyStringProperty' ) )
    },
    vectorNode: {
      body: {
        accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleNameStringProperty' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorNode_body_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponseStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleObjectResponseStringProperty' ),
        accessibleObjectResponseTipOutsideGraphAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.body.accessibleObjectResponseTipOutsideGraphAreaStringProperty' )
      },
      tip: {
        accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleNameStringProperty' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_vectorNode_tip_accessibleHelpText', _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponseCartesianStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleObjectResponseCartesianStringProperty' ),
        accessibleObjectResponseCartesianTipReturnedToGraphAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleObjectResponseCartesianTipReturnedToGraphAreaStringProperty' ),
        accessibleObjectResponsePolarStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleObjectResponsePolarStringProperty' ),
        accessibleObjectResponsePolarTipReturnedToGraphAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorNode.tip.accessibleObjectResponsePolarTipReturnedToGraphAreaStringProperty' )
      }
    },
    equationsVectorNode: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.equationsVectorNode.accessibleNameStringProperty' )
    },
    baseVectorNode: {
      accessibleNameStringProperty: _.get( VectorAdditionStrings, 'a11y.baseVectorNode.accessibleNameStringProperty' )
    },
    vectorAddedToGraphAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorAddedToGraphAreaStringProperty' ),
    vectorRemovedFromGraphAreaStringProperty: _.get( VectorAdditionStrings, 'a11y.vectorRemovedFromGraphAreaStringProperty' )
  }
};

export default VectorAdditionFluent;

vectorAddition.register('VectorAdditionFluent', VectorAdditionFluent);
