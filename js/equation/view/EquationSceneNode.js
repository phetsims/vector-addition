// Copyright 2019, University of Colorado Boulder

/**
 * A Scene Node specific to the 'Equation' screen. See ../common/view/SceneNode for context on Scene
 *
 * 'Is A' relationship with Scene Node but adds:
 *  - a Equation Selector Radio Button Group
 *  - a Coefficient Selector Panel for each Equation Type
 *  - a Base Vector Accordion Box
 *  - Base Vectors and their components,
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorsAccordionBox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsAccordionBox' );
  const CoefficientSelectorPanel = require( 'VECTOR_ADDITION/equation/view/CoefficientSelectorPanel' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants

  // Passed to the super class (SceneNode) as the 'options' parameter
  const SCENE_NODE_OPTIONS = {
    includeEraser: false,               // Disable the Eraser button
    includeBaseVectors: true,           // Create a Vector Layer for Base Vectors and a layer for their components!
    sumNodeOptions: {
      fill: VectorAdditionColors.EQUATION_SUM_FILL
    },
    vectorValuesPanelOptions: {
      spacingMajor: 25,
      contentFixedWidth: 470
    }
  };
  const BASE_VECTOR_OPACITY = 0.38;
  const PANEL_CENTER_Y = 100;

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} equationGraph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    constructor( equationGraph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty ) {

      super( equationGraph,
        valuesVisibleProperty,
        angleVisibleProperty,
        gridVisibleProperty,
        componentStyleProperty,
        SCENE_NODE_OPTIONS);

      const graphViewBounds = equationGraph.modelViewTransformProperty.value.modelToViewBounds( equationGraph.graphModelBounds );

      //----------------------------------------------------------------------------------------
      // Add the equation types radio button Group

      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( equationGraph.equationTypeProperty,
        equationGraph.vectorSet.symbols, {
          centerY: PANEL_CENTER_Y,
          right: graphViewBounds.maxX
        } );

      this.addChild( equationTypesRadioButtonGroup );
      equationTypesRadioButtonGroup.moveToBack();


      // Add the coefficient for each equation type
      EquationTypes.VALUES.forEach( equationType => {

        const coefficientSelectorPanel = new CoefficientSelectorPanel( equationGraph.vectorSet, equationType, {
          centerY: PANEL_CENTER_Y
        } );

        // Doesn't need to be unlinked since the coefficientSelectorPanel is never disposed
        equationGraph.equationTypeProperty.link( () => {
          coefficientSelectorPanel.visible = equationType === equationGraph.equationTypeProperty.value;
        } );

        this.addChild( coefficientSelectorPanel );
        coefficientSelectorPanel.moveToBack();

      } );

      //----------------------------------------------------------------------------------------
      // Add the base vectors

      equationGraph.vectorSet.vectors.forEach( ( vector ) => {

        const baseVector = new VectorNode( vector.baseVector, equationGraph, valuesVisibleProperty, angleVisibleProperty, {
          opacity: BASE_VECTOR_OPACITY
        } );

        equationGraph.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.baseVectorContainer.addChild( baseVector );
      } );


      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( equationGraph.baseVectorsVisibleProperty,
        equationGraph.coordinateSnapMode,
        equationGraph.vectorSet );





      // Add the base vectors accordion box (semi-global)
      this.addChild( baseVectorsAccordionBox );

      baseVectorsAccordionBox.moveToBack();
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );