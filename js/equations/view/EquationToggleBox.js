// Copyright 2019, University of Colorado Boulder

/**
 * EquationToggleBox is the toggle box labeled 'Equation' in the 'Equations' screen.
 * It allows the user to select the form of the equation, and change the coefficients of the vectors.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypeNode = require( 'VECTOR_ADDITION/equations/view/EquationTypeNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equations/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equations/view/EquationTypesRadioButtonGroup' );
  const EquationsVectorSet = require( 'VECTOR_ADDITION/equations/model/EquationsVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToggleBox = require( 'VECTOR_ADDITION/common/view/ToggleBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const equationString = require( 'string!VECTOR_ADDITION/equation' );

  // constants
  const TEXT_OPTIONS = { font: VectorAdditionConstants.EQUATION_FONT };

  class EquationToggleBox extends ToggleBox {

    /**
     * @param {EquationsVectorSet} vectorSet
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {AlignGroup} equationButtonsAlignGroup - used to make all equation radio buttons the same size
     * @param {AlignGroup} equationsAlignGroup - used to make all interactive equations the same size
     * @param {Object} [options]
     */
    constructor( vectorSet, equationTypeProperty, equationButtonsAlignGroup, equationsAlignGroup, options ) {

      assert && assert( vectorSet instanceof EquationsVectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( equationTypeProperty instanceof EnumerationProperty, `invalid equationTypeProperty: ${equationTypeProperty}` );
      assert && assert( equationButtonsAlignGroup instanceof AlignGroup, `invalid equationButtonsAlignGroup: ${equationButtonsAlignGroup}` );
      assert && assert( equationsAlignGroup instanceof AlignGroup, `invalid equationsAlignGroup: ${equationsAlignGroup}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = merge( {

        // superclass options
        contentFixedWidth: 670,
        contentFixedHeight: 50,
        contentXSpacing: 17

      }, options );

      // When the toggle box is collapsed, show 'Equation'
      const closedContent = new Text( equationString, TEXT_OPTIONS );

      // Radio buttons for selecting equation type
      const radioButtonGroup = new EquationTypesRadioButtonGroup(
        equationTypeProperty, vectorSet.symbols, equationButtonsAlignGroup, {
          scale: 0.85
        } );

      // Create an equation of each type, only one of which will be visible at a time.
      const equationsParent = new Node();
      EquationTypes.VALUES.forEach( equationType => {

        const equationTypeNode = new EquationTypeNode( vectorSet, equationType );
        equationsParent.addChild( new AlignBox( equationTypeNode, {
          group: equationsAlignGroup,
          xAlign: 'left'
        } ) );

        // unlink is unnecessary, exists for the lifetime of the sim.
        equationTypeProperty.link( () => {
          equationTypeNode.visible = ( equationType === equationTypeProperty.value );
        } );
      } );

      // Radio buttons on the left, equation on the right. See https://github.com/phetsims/vector-addition/issues/128
      const openContent = new HBox( {
        children: [ radioButtonGroup, equationsParent ],
        spacing: 40
      } );

      super( closedContent, openContent, options );

      // When the box is collapsed, cancel interactions.
      // unlink is not necessary, exists for the lifetime of the sim.
      this.expandedProperty.lazyLink( expanded => {
        if ( !expanded ) {
          this.interruptSubtreeInput();
        }
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'EquationToggleBox is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'EquationToggleBox', EquationToggleBox );
} );