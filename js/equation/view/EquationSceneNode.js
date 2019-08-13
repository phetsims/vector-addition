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
  const CoefficientSelectorPanel = require( 'VECTOR_ADDITION/equation/view/CoefficientSelectorPanel' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const merge = require( 'PHET_CORE/merge' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} equationGraph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( equationGraph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 options ) {


      options = merge( {

        // specific to this class
        baseVectorOpacity: 0.38,  // {number} opacity of Base Vector Nodes and their components
        panelCenterY: 100,        // {number} centerY of the equationTypesRadioButtonGroup and the
                                  //          coefficientSelectorPanel


        // super-class options
        includeEraser: false,
        sumNodeOptions: {
          fill: VectorAdditionColors.EQUATION_SUM_FILL
        },
        vectorValuesPanelOptions: {
          spacingMajor: 25,
          contentFixedWidth: 470
        }

      }, options );


      super( equationGraph,
        valuesVisibleProperty,
        angleVisibleProperty,
        gridVisibleProperty,
        componentStyleProperty,
        options );


      //----------------------------------------------------------------------------------------
      // Add the "Equation Selector Radio Button Group"

      // convenience reference
      const graphViewBounds = equationGraph.modelViewTransformProperty.value.modelToViewBounds( equationGraph.graphModelBounds );

      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( equationGraph.equationTypeProperty,
        equationGraph.vectorSet.symbols, {
          centerY: options.panelCenterY,
          right: graphViewBounds.maxX
        } );

      this.addChild( equationTypesRadioButtonGroup );
      equationTypesRadioButtonGroup.moveToBack(); // move to back to keep Vector Containers on top in the super class


      //----------------------------------------------------------------------------------------
      // Add a Coefficient Selector Panel for each Equation Type
      EquationTypes.VALUES.forEach( equationType => {

        const coefficientSelectorPanel = new CoefficientSelectorPanel( equationGraph.vectorSet, equationType, {
          centerY: options.panelCenterY
        } );

        // Doesn't need to be unlinked since the coefficientSelectorPanel and the scene is never disposed
        equationGraph.equationTypeProperty.link( () => {
          coefficientSelectorPanel.visible = equationType === equationGraph.equationTypeProperty.value;
        } );

        this.addChild( coefficientSelectorPanel );
        coefficientSelectorPanel.moveToBack(); // move to back to keep Vector Containers on top in the super class

      } );

      //----------------------------------------------------------------------------------------
      // Add a Base Vector Accordion Box

      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( equationGraph.baseVectorsVisibleProperty,
        equationGraph.coordinateSnapMode,
        equationGraph.vectorSet );

      // Add the base vectors accordion box (semi-global)
      this.addChild( baseVectorsAccordionBox );

      baseVectorsAccordionBox.moveToBack();


      //----------------------------------------------------------------------------------------
      // 'Register' Vectors and add their Base Vectors and their components
      equationGraph.vectorSet.vectors.forEach( equationVector => {

        // register the vector to create the Nodes
        this.registerVector( equationVector, equationGraph.vectorSet );


        // TODO: create add the components
        const baseVector = new VectorNode( equationVector.baseVector, equationGraph, valuesVisibleProperty, angleVisibleProperty, {
          opacity: options.baseVectorOpacity
        } );
        equationGraph.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.baseVectorContainer.addChild( baseVector );
      } );

    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );