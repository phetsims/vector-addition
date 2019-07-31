// Copyright 2019, University of Colorado Boulder

/**
 * The scene node for the 'Equation' screen.
 *
 * 'Is A' relationship with Scene Node but adds,
 *  - a Equation Selector Radio Button Group
 *  - 3 Coefficient Selector Panel (one for each equation type)
 *  - a Base Vector Accordion Box
 *  - base vector nodes
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
  const VECTOR_SUM_COLORS = {
    fill: VectorAdditionColors.BLACK,
    component: VectorAdditionColors.GREY
  };
  const BASE_VECTOR_OPACITY = 0.38;
  const PANEL_CENTER_Y = 110;

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( graph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 options ) {

      options = _.extend( {
        includeEraser: false,
        includeBaseVectors: true,
        sumNodeOptions: VECTOR_SUM_COLORS
      }, options );

      super( graph,
        valuesVisibleProperty,
        angleVisibleProperty,
        gridVisibleProperty,
        componentStyleProperty,
        options );

      //----------------------------------------------------------------------------------------
      // Add the equation types radio button Group

      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( graph.equationTypeProperty,
        graph.vectorSet.symbols, {
          centerY: PANEL_CENTER_Y
        } );

      this.addChild( equationTypesRadioButtonGroup );
      equationTypesRadioButtonGroup.moveToBack();


      // Add the coefficient for each equation type
      EquationTypes.VALUES.forEach( equationType => {

        const coefficientSelectorPanel = new CoefficientSelectorPanel( graph.vectorSet, equationType, {
          centerY: PANEL_CENTER_Y
        } );

        // Doesn't need to be unlinked since the coefficientSelectorPanel is never disposed
        graph.equationTypeProperty.link( () => {
          coefficientSelectorPanel.visible = equationType === graph.equationTypeProperty.value;
        } );

        this.addChild( coefficientSelectorPanel );
        coefficientSelectorPanel.moveToBack();

      } );

      //----------------------------------------------------------------------------------------
      // Add the base vectors

      graph.vectorSet.vectors.forEach( ( vector ) => {

        const baseVector = new VectorNode( vector.baseVector, graph, valuesVisibleProperty, angleVisibleProperty, {
          opacity: BASE_VECTOR_OPACITY
        } );

        graph.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.baseVectorContainer.addChild( baseVector );
      } );


      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( graph.baseVectorsVisibleProperty,
        graph.coordinateSnapMode,
        graph.vectorSet );
      // Add the base vectors accordion box (semi-global)
      this.addChild( baseVectorsAccordionBox );

      baseVectorsAccordionBox.moveToBack();
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );