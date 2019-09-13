// Copyright 2019, University of Colorado Boulder

/**
 * A Scene Node specific to the 'Equation' screen. See ../common/view/SceneNode.js for context on Scene Node
 *
 * 'Is A' relationship with Scene Node but adds:
 *  - a Equation Selector Radio Button Group
 *  - a Coefficient Selector Panel for each Equation Type
 *  - a Base Vector Accordion Box
 *  - 'register' Vectors and add their Base Vectors and their components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorsAccordionBox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsAccordionBox' );
  const EquationToggleBox = require( 'VECTOR_ADDITION/equation/view/EquationToggleBox' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const merge = require( 'PHET_CORE/merge' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} equationGraph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {BooleanProperty} vectorValuesExpandedProperty
     * @param {BooleanProperty} equationsExpandedProperty
     * @param {BooleanProperty} baseVectorsExpandedProperty
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {number} graphControlPanelBottom
     * @param {Object} [options]
     */
    constructor( equationGraph,
                 valuesVisibleProperty,
                 anglesVisibleProperty,
                 gridVisibleProperty,
                 vectorValuesExpandedProperty,
                 equationsExpandedProperty,
                 baseVectorsExpandedProperty,
                 baseVectorsVisibleProperty,
                 componentStyleProperty,
                 graphControlPanelBottom,
                 options ) {

      options = merge( {

        // super-class options
        includeEraser: false,
        vectorValuesToggleBoxOptions: {
          spacingMajor: 25,
          contentFixedWidth: 470
        }

      }, options );

      super( equationGraph,
        valuesVisibleProperty,
        anglesVisibleProperty,
        gridVisibleProperty,
        vectorValuesExpandedProperty,
        componentStyleProperty,
        options );

      // convenience reference
      const graphViewBounds = equationGraph.modelViewTransformProperty.value.modelToViewBounds( equationGraph.graphModelBounds );

      //----------------------------------------------------------------------------------------
      // Add a Coefficient Selector for each Equation Type
      let lastEquationToggleBox = null;
      EquationTypes.VALUES.forEach( equationType => {

        const equationToggleBox = new EquationToggleBox( equationGraph.vectorSet, equationType, {
          expandedProperty: equationsExpandedProperty,
          left: graphViewBounds.left,
          top: this.vectorValuesToggleBox.bottom + 10
        } );

        // Doesn't need to be unlinked since the equationToggleBox and the scene is never disposed
        equationGraph.equationTypeProperty.link( () => {
          equationToggleBox.visible = equationType === equationGraph.equationTypeProperty.value;
        } );

        this.addChild( equationToggleBox );
        equationToggleBox.moveToBack(); // move to back to keep Vector Containers on top in the super class

        lastEquationToggleBox = equationToggleBox;
      } );

      //----------------------------------------------------------------------------------------
      // Add the "Equation Selector Radio Button Group"
      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( equationGraph.equationTypeProperty,
        equationGraph.vectorSet.symbols, {
          centerY: lastEquationToggleBox.centerY,
          left: lastEquationToggleBox.right + 20
        } );

      this.addChild( equationTypesRadioButtonGroup );
      equationTypesRadioButtonGroup.moveToBack(); // move to back to keep Vector Containers on top in the super class

      //----------------------------------------------------------------------------------------
      // Add a Base Vector Accordion Box

      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( baseVectorsVisibleProperty,
        equationGraph.coordinateSnapMode,
        equationGraph.vectorSet, {
        expandedProperty: baseVectorsExpandedProperty,
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: graphControlPanelBottom + 8
        } );

      // Add the base vectors accordion box (semi-global)
      this.addChild( baseVectorsAccordionBox );
      baseVectorsAccordionBox.moveToBack();

      //----------------------------------------------------------------------------------------
      // 'Register' Vectors and add their Base Vectors and their components
      equationGraph.vectorSet.vectors.forEach( equationVector => {

        // register the vector to create the Nodes
        this.registerVector( equationVector, equationGraph.vectorSet );

        // TODO: create add the components
        const baseVector = new VectorNode( equationVector.baseVector, equationGraph, valuesVisibleProperty,
          anglesVisibleProperty, {
            arrowOptions: _.extend( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
              fill: equationGraph.vectorSet.vectorColorPalette.baseVectorFill,
              stroke: equationGraph.vectorSet.vectorColorPalette.baseVectorStroke
            } )
        } );

        baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.baseVectorContainer.addChild( baseVector );
      } );
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );